"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Check, Clock, AlertCircle, Loader2 } from 'lucide-react';
import SeatMap from './SeatMap';
import PaymentView from './PaymentView';
import { apiRequest } from '@/app/lib/api'; 

export interface SeatType {
  id: number;
  name: string;
  seatRow: string;
  seatNumber: string;
  seatType: 'NORMAL' | 'VIP' | 'SWEETBOX'; 
  price: number;
  status: string;
}

export default function BookingModal({ info, onClose }: any) {
  const [step, setStep] = useState(1); 
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
  const [dbSeats, setDbSeats] = useState<SeatType[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'error' | 'info' = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // 1. FETCH GHẾ TỪ API (Sửa đường dẫn truy cập Room ID)
  useEffect(() => {
    const fetchSeats = async () => {
      setLoadingSeats(true);
      try {
        // Lấy room id từ cấu trúc info.room.id, nếu không có thì giả lập là 1
        const targetRoomId = info?.room?.id || 1; 
        console.log("Fetching seats for Room ID:", targetRoomId);

        const res = await apiRequest(`/api/v1/seats/room/${targetRoomId}`);
        
        if (res.ok) {
          const result = await res.json();
          // Nếu có dữ liệu từ database thì set vào state
          if (result.data && result.data.length > 0) {
            setDbSeats(result.data);
            return;
          }
        }

        // 2. FALLBACK GIẢ LẬP (Phòng trường hợp DB rỗng hoặc lỗi API để không bị trắng màn)
        console.warn("API không có dữ liệu cho room này, đang dùng dữ liệu giả lập...");
        const mockSeats: SeatType[] = [];
        ['A', 'B', 'C', 'D', 'E'].forEach((row) => {
          for (let i = 1; i <= 10; i++) {
            mockSeats.push({
              id: Math.random(),
              name: `${row}${i}`,
              seatRow: row,
              seatNumber: i.toString(),
              seatType: i > 8 ? 'VIP' : 'NORMAL',
              price: i > 8 ? 90000 : 75000,
              status: (row === 'A' && i < 3) ? 'SOLD' : 'AVAILABLE'
            });
          }
        });
        setDbSeats(mockSeats);

      } catch (err) {
        console.error("Fetch error:", err);
        showToast("Lỗi kết nối server!");
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchSeats();
  }, [info]); // Theo dõi info để update khi suất chiếu thay đổi

  // 2. LOGIC CHỌN GHẾ
  const toggleSeat = useCallback((seat: SeatType) => {
    setSelectedSeats((prev) => {
      const isExist = prev.find((s) => s.id === seat.id);
      if (isExist) return prev.filter((s) => s.id !== seat.id);

      if (prev.length >= 8) {
        showToast("Tối đa 8 ghế mỗi đơn hàng!");
        return prev;
      }

      // Nghiệp vụ chặn trống 1 ghế ở giữa
      const rowName = seat.seatRow;
      const seatNum = parseInt(seat.seatNumber);
      const occupiedInRow = dbSeats.filter(s => s.seatRow === rowName && s.status !== 'AVAILABLE').map(s => parseInt(s.seatNumber));
      const selectingInRow = prev.filter(s => s.seatRow === rowName).map(s => parseInt(s.seatNumber));
      const allTaken = [...occupiedInRow, ...selectingInRow];

      if ((allTaken.includes(seatNum + 2) && !allTaken.includes(seatNum + 1)) || 
          (allTaken.includes(seatNum - 2) && !allTaken.includes(seatNum - 1))) {
        showToast("Vui lòng không để trống 1 ghế ở giữa!");
        return prev;
      }

      return [...prev, seat].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    });
  }, [dbSeats]);

  // 3. ĐẶT VÉ & THANH TOÁN
  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) return;
    setLoading(true);

    try {
      // POST Order - Dùng info.id là ID của suất chiếu
      const orderRes = await apiRequest(`/api/v1/orders`, {
        method: 'POST',
        body: JSON.stringify({
          showtimeId: info.id, 
          seatIds: selectedSeats.map(s => s.id),
          totalPrice: totalAmount
        })
      });

      const orderData = await orderRes.json();

      if (orderRes.ok) {
        const orderId = orderData.data?.id || orderData.id; 
        const paymentRes = await apiRequest(`/api/v1/payments/order/${orderId}`, { 
            method: 'POST',
            body: JSON.stringify({ method: paymentMethod }) 
        });

        if (paymentRes.ok) {
          setIsSuccess(true);
          setTimeout(() => { 
            onClose(); 
            window.location.reload(); 
          }, 2500);
        } else {
          showToast("Lỗi thanh toán!");
        }
      } else {
        showToast(orderData.message || "Ghế đã có người đặt!");
      }
    } catch (error) {
      showToast("Lỗi hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  // 4. TIMER
  useEffect(() => {
    if (selectedSeats.length > 0 && !isSuccess && step === 1) {
      const timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
      if (timeLeft === 0) { 
        showToast("Hết thời gian giữ chỗ!"); 
        setTimeout(onClose, 1000); 
      }
      return () => clearInterval(timer);
    }
  }, [timeLeft, selectedSeats.length, isSuccess, step, onClose]);

  const totalAmount = useMemo(() => selectedSeats.reduce((sum, s) => sum + s.price, 0), [selectedSeats]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={onClose}></div>
      
      <div className="relative z-10 bg-[#050505] w-full max-w-7xl h-full md:h-[94vh] md:rounded-[3rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
        
        {toast && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-top-full">
            <div className="px-6 py-3 rounded-2xl bg-red-600 border border-red-500 text-white shadow-2xl flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest">
              <AlertCircle size={16} /> {toast.msg}
            </div>
          </div>
        )}

        {isSuccess && <SuccessOverlay />}

        {/* HEADER */}
        <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/10">
          <div className="flex items-center gap-4">
             <div className="w-1 bg-red-600 h-8 rounded-full"></div>
             <div>
                <h2 className="text-white text-xl font-[1000] italic uppercase tracking-tighter leading-none">
                    {info?.movie?.title || "Đang tải tên phim..."}
                </h2>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                    {info?.room?.cinemaItem?.name || 'Vinacenter'} • {info?.startTime ? new Date(info.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : ''}
                </p>
             </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-600 transition-all group">
            <X className="text-zinc-500 group-hover:text-white" size={20}/>
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-hidden relative">
          {step === 1 ? (
             <SeatMap 
                dbSeats={dbSeats} 
                selectedSeats={selectedSeats} 
                onToggleSeat={toggleSeat} 
                loading={loadingSeats} 
             />
          ) : (
            <PaymentView 
              info={info}
              selectedSeats={selectedSeats.map(s => s.name)}
              totalPrice={totalAmount}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onBack={() => setStep(1)}
              onConfirm={handleConfirmBooking}
              loading={loading}
            />
          )}
        </div>

        {/* FOOTER */}
        {step === 1 && (
          <div className="p-8 md:px-14 bg-black border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-8 items-center">
              <div>
                 <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest mb-1 italic">Ghế đã chọn</p>
                 <div className="flex gap-2 min-h-[30px] items-baseline">
                    {selectedSeats.length > 0 ? selectedSeats.map(s => (
                      <span key={s.id} className="text-red-600 font-[1000] italic text-2xl animate-in zoom-in">{s.name}</span>
                    )) : <span className="text-zinc-900 font-black italic">CHƯA CHỌN</span>}
                 </div>
              </div>
              <div className="h-10 w-[1px] bg-white/5 hidden md:block"></div>
              <div>
                <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest mb-1 italic">Tổng tiền</p>
                <div className="text-3xl font-[1000] text-white italic tracking-tighter leading-none">
                  {totalAmount.toLocaleString()} <span className="text-[10px] text-red-600">VND</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
              {selectedSeats.length > 0 && (
                <div className="flex flex-col items-end pr-6 border-r border-white/5">
                  <p className="text-[8px] text-zinc-700 font-black uppercase italic mb-1">Giữ chỗ trong</p>
                  <div className="text-red-600 font-mono font-black text-lg flex items-center gap-2">
                    <Clock size={14} /> <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
              )}
              <button 
                onClick={() => setStep(2)} 
                disabled={selectedSeats.length === 0}
                className="flex-1 md:flex-none px-12 py-5 bg-red-600 hover:bg-red-500 disabled:bg-zinc-900 disabled:text-zinc-800 text-white rounded-2xl font-[1000] uppercase text-[11px] tracking-[0.3em] shadow-2xl transition-all active:scale-95"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SuccessOverlay = () => (
  <div className="absolute inset-0 z-[120] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-500 backdrop-blur-xl">
    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-[0_0_40px_rgba(34,197,94,0.4)]">
      <Check size={40} className="text-white stroke-[4]" />
    </div>
    <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">ĐẶT VÉ THÀNH CÔNG</h2>
    <p className="text-zinc-600 text-[9px] mt-4 uppercase font-black tracking-[0.5em]">Hệ thống đang chuyển hướng...</p>
  </div>
);