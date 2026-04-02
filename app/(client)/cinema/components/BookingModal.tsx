"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Check, Clock, AlertCircle } from 'lucide-react';
import SeatMap from './SeatMap';
import PaymentView from './PaymentView';
import { apiRequest } from '@/app/lib/api'; // Import hàm apiRequest của bà

// Định nghĩa chuẩn Type để đồng bộ dữ liệu giữa các Component
export interface SeatType {
  id: number;
  seatRow: string;
  seatNumber: string;
  seatLabel: string;
  price: number;
  status?: string;
}

export default function BookingModal({ info, onClose }: any) {
  const [step, setStep] = useState(1); 
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
  const [dbSeats, setDbSeats] = useState<SeatType[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'error' | 'info' = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // 1. FETCH DỮ LIỆU GHẾ - SỬ DỤNG apiRequest
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await apiRequest(`/api/v1/seats/room/${info.roomId}`);
        if (res.ok) {
          const result = await res.json();
          setDbSeats(result.data || []);
        }
      } catch (err) {
        console.error("Lỗi fetch ghế:", err);
      }
    };
    if (info?.roomId) fetchSeats();
  }, [info.roomId]);

  // 2. NGHIỆP VỤ CHỌN/HỦY & CHẶN GHẾ TRỐNG
  const toggleSeat = useCallback((seat: SeatType) => {
    setSelectedSeats((prev) => {
      const isExist = prev.find((s) => s.id === seat.id);
      if (isExist) return prev.filter((s) => s.id !== seat.id);

      if (prev.length >= 8) {
        showToast("Tối đa 8 ghế mỗi đơn hàng!");
        return prev;
      }

      const rowName = seat.seatRow;
      const seatNum = parseInt(seat.seatNumber);
      
      const occupiedInRow = dbSeats.filter((s) => s.seatRow === rowName && (s.status === 'OCCUPIED' || !s.status)).map((s) => parseInt(s.seatNumber));
      const selectingInRow = prev.filter((s) => s.seatRow === rowName).map((s) => parseInt(s.seatNumber));
      const allTaken = [...occupiedInRow, ...selectingInRow];

      const gapRight = allTaken.includes(seatNum + 2) && !allTaken.includes(seatNum + 1);
      const gapLeft = allTaken.includes(seatNum - 2) && !allTaken.includes(seatNum - 1);

      if (gapRight || gapLeft) {
        showToast("Không được để trống 1 ghế ở giữa!");
        return prev;
      }

      return [...prev, seat].sort((a, b) => a.seatLabel.localeCompare(b.seatLabel, undefined, { numeric: true }));
    });
  }, [dbSeats]);

  // 3. XỬ LÝ THANH TOÁN & LƯU DB - SỬ DỤNG apiRequest
  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) return;
    setLoading(true);

    const orderRequest = {
      showtimeId: info.id, 
      seatIds: selectedSeats.map(s => s.id),
      totalPrice: totalAmount
    };

    try {
      // Gọi tạo đơn hàng
      const orderRes = await apiRequest(`/api/v1/orders`, {
        method: 'POST',
        body: JSON.stringify(orderRequest)
      });

      const orderData = await orderRes.json();

      if (orderRes.ok) {
        const orderId = orderData.data?.id || orderData.id; 
        
        // Gọi thanh toán cho đơn hàng vừa tạo
        const paymentRes = await apiRequest(`/api/v1/payments/order/${orderId}`, {
          method: 'POST'
        });

        if (paymentRes.ok) {
          setIsSuccess(true);
          setTimeout(() => { 
            onClose(); 
            window.location.reload(); 
          }, 3000);
        } else {
          showToast("Lỗi xử lý thanh toán!", "error");
        }
      } else {
        showToast(orderData.message || "Lỗi đặt vé!", "error");
      }
    } catch (error) {
      showToast("Không thể kết nối đến server!", "error");
    } finally {
      setLoading(false);
    }
  };

  // 4. TIMER GIỮ CHỖ
  useEffect(() => {
    if (step === 1 && selectedSeats.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      
      if (timeLeft === 0) {
        showToast("Hết thời gian giữ chỗ!");
        setTimeout(onClose, 1000);
      }
      return () => clearInterval(timer);
    }
  }, [timeLeft, selectedSeats.length, step, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalAmount = useMemo(() => selectedSeats.reduce((sum, s) => sum + s.price, 0), [selectedSeats]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative z-10 bg-[#0a0a0a] w-full max-w-7xl h-[94vh] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
        
        {toast && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-top-full">
            <div className={`px-6 py-3 rounded-2xl border backdrop-blur-xl flex items-center gap-3 ${
              toast.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-white/10 border-white/20 text-white'
            }`}>
              <AlertCircle size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">{toast.msg}</span>
            </div>
          </div>
        )}

        {isSuccess && <SuccessOverlay />}

        {step === 1 && (
          <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-black/20">
            <div>
              <h2 className="text-white text-2xl font-[1000] italic uppercase tracking-tighter leading-none">{info.title}</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">{info.time} • Chọn chỗ ngồi</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-600 transition-all">
              <X className="text-white" size={18}/>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          {step === 1 ? (
             <SeatMap dbSeats={dbSeats} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
          ) : (
            <PaymentView 
              info={info}
              selectedSeats={selectedSeats.map(s => s.seatLabel)}
              totalPrice={totalAmount}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onBack={() => setStep(1)}
              onConfirm={handleConfirmBooking}
              loading={loading}
            />
          )}
        </div>

        {step === 1 && (
          <div className="p-8 md:px-14 bg-[#080808] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                 <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest italic">Ghế đã chọn:</span>
                 <div className="flex gap-2">
                    {selectedSeats.length > 0 ? selectedSeats.map(s => (
                      <span key={s.seatLabel} className="text-red-600 font-[1000] italic text-xl animate-bounce-short">{s.seatLabel}</span>
                    )) : <span className="text-zinc-800 italic text-sm font-bold">...</span>}
                 </div>
              </div>
              <div className="text-4xl font-[1000] text-white italic tracking-tighter">
                {totalAmount.toLocaleString()} <span className="text-red-600 text-[10px] uppercase ml-1">VND</span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              {selectedSeats.length > 0 && (
                <div className="flex flex-col items-end px-6 border-r border-white/5">
                  <p className="text-[9px] text-zinc-500 font-black uppercase mb-1 italic">Hết hạn sau</p>
                  <div className="text-red-600 font-mono font-black text-xl flex items-center gap-2">
                    <Clock size={16} /> <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>
              )}
              <button 
                onClick={() => setStep(2)} 
                disabled={selectedSeats.length === 0}
                className="px-14 py-5 bg-red-600 hover:bg-red-500 disabled:bg-zinc-900 disabled:text-zinc-500 text-white rounded-full font-[1000] uppercase text-[12px] tracking-[0.4em] shadow-xl"
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SuccessOverlay = () => (
  <div className="absolute inset-0 z-[120] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-700 backdrop-blur-md">
    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.5)]">
      <Check size={48} className="text-white stroke-[4]" />
    </div>
    <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">Đặt vé thành công!</h2>
    <p className="text-zinc-500 text-[10px] mt-4 uppercase font-black tracking-[0.4em]">Giao dịch hoàn tất</p>
  </div>
);