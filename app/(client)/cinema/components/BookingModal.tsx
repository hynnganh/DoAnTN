"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Check, Clock, AlertCircle, Info, ChevronLeft, CreditCard, QrCode } from 'lucide-react';
import SeatMap from './SeatMap';

export default function BookingModal({ info, onClose }: any) {
  const [step, setStep] = useState(1); // 1: Chọn ghế, 2: Thanh toán
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [dbSeats, setDbSeats] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'error' | 'info' = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const getToken = () => localStorage.getItem('token') || localStorage.getItem('accessToken');

  // Đếm ngược giữ chỗ
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

  // Fetch ghế từ API
  useEffect(() => {
    const fetchSeats = async () => {
      const token = getToken();
      try {
        const res = await fetch(`http://localhost:8080/api/v1/seats/room/${info.roomId}`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        });
        if (res.ok) {
          const result = await res.json();
          setDbSeats(result.data || []);
        }
      } catch (err) { console.error("Lỗi fetch ghế:", err); }
    };
    if (info?.roomId) fetchSeats();
  }, [info.roomId]);

  const toggleSeat = useCallback((seat: any) => {
  setSelectedSeats((prev) => {
    const isExist = prev.find((s) => s.seatLabel === seat.seatLabel);
    if (isExist) return prev.filter((s) => s.seatLabel !== seat.seatLabel);

    if (prev.length >= 8) {
      showToast("Tối đa 8 ghế mỗi đơn hàng!");
      return prev;
    }

    // --- LOGIC CHẶN GHẾ TRỐNG Ở GIỮA ---
    const rowName = seat.row;
    const seatNum = parseInt(seat.num);

    // 1. Tìm các ghế đã có người đặt (dbSeats) và các ghế đang chọn (prev) trong cùng hàng
    const occupiedInRow = dbSeats
      .filter((s: any) => s.seatRow === rowName)
      .map((s: any) => parseInt(s.seatNumber));
    
    const selectingInRow = prev
      .filter((s: any) => s.row === rowName)
      .map((s: any) => parseInt(s.num));

    const allTaken = [...occupiedInRow, ...selectingInRow];

    // 2. Kiểm tra nếu chọn ghế này có tạo ra khoảng trống "1 ghế" không
    // Check bên phải: Nếu ghế cách 2 vị trí (n+2) đã có người ngồi, mà ghế ngay cạnh (n+1) trống
    if (allTaken.includes(seatNum + 2) && !allTaken.includes(seatNum + 1)) {
       showToast("Không được để trống 1 ghế ở giữa!", "error");
       return prev;
    }

    // Check bên trái: Nếu ghế (n-2) đã có người ngồi, mà ghế ngay cạnh (n-1) trống
    if (allTaken.includes(seatNum - 2) && !allTaken.includes(seatNum - 1)) {
       showToast("Không được để trống 1 ghế ở giữa!", "error");
       return prev;
    }
    // ----------------------------------

    return [...prev, seat].sort((a, b) => 
      a.seatLabel.localeCompare(b.seatLabel, undefined, { numeric: true })
    );
  });
}, [dbSeats, showToast]); // Nhớ thêm dbSeats vào dependencies

  const totalAmount = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);
  }, [selectedSeats]);

  const handleBooking = () => {
    // Giả lập xử lý thanh toán
    showToast("Đang khởi tạo giao dịch...", "info");
    setTimeout(() => setIsSuccess(true), 2000);
    setTimeout(onClose, 4000);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose}></div>
      
      <div className="relative z-10 bg-[#0a0a0a] w-full max-w-6xl h-[92vh] rounded-[3.5rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
        
        {/* Toast Notification */}
        {toast && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-top-full">
            <div className={`px-6 py-3 rounded-2xl border backdrop-blur-xl flex items-center gap-3 ${
              toast.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-white/10 border-white/20 text-white'
            }`}>
              <AlertCircle size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">{toast.msg}</span>
            </div>
          </div>
        )}

        {isSuccess && <SuccessOverlay />}

        {/* Header Section */}
        <div className="px-10 py-8 border-b border-white/5 bg-gradient-to-r from-red-950/20 to-transparent flex justify-between items-center">
          <div className="flex gap-6 items-center">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                <ChevronLeft className="text-white" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-3 mb-1">
                 <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded italic">C18</span>
                 <h2 className="text-white text-2xl font-[1000] italic uppercase tracking-tighter leading-none">{info.title}</h2>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                {step === 1 ? 'Chọn ghế ngồi' : 'Thanh toán vé'} • {info.time}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-600 transition-all group">
            <X className="text-zinc-500 group-hover:text-white" size={20}/>
          </button>
        </div>

        {/* MAIN CONTENT: Conditional Rendering Step 1 & 2 */}
        <div className="flex-1 overflow-hidden relative">
          {step === 1 ? (
            <div className="w-full h-full animate-in fade-in zoom-in-95 duration-500">
               <SeatMap 
                 dbSeats={dbSeats} 
                 selectedSeats={selectedSeats} 
                 onToggleSeat={toggleSeat} 
                 onShowToast={showToast}
               />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-10 bg-[#050505] animate-in slide-in-from-right duration-500">
              <div className="max-w-md w-full bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 text-center">
                <QrCode className="mx-auto text-red-600 mb-6" size={64} />
                <h3 className="text-white text-xl font-black uppercase italic mb-2">Quét mã thanh toán</h3>
                <p className="text-zinc-500 text-xs mb-8 uppercase tracking-widest font-bold">Vui lòng sử dụng ứng dụng Ngân hàng hoặc MoMo</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[11px] font-bold uppercase text-zinc-400">
                    <span>Số lượng ghế:</span>
                    <span className="text-white">{selectedSeats.length} ghế</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold uppercase text-zinc-400">
                    <span>Vị trí:</span>
                    <span className="text-red-500 italic">{selectedSeats.map(s => s.seatLabel).join(', ')}</span>
                  </div>
                  <div className="h-px bg-white/5 w-full"></div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-black text-zinc-500 uppercase">Tổng cộng:</span>
                    <span className="text-3xl font-[1000] text-white italic">{totalAmount.toLocaleString()} VNĐ</span>
                  </div>
                </div>

                <button 
                  onClick={handleBooking}
                  className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-[1000] uppercase text-[11px] tracking-[0.3em] shadow-[0_15px_30px_rgba(220,38,38,0.2)]"
                >
                  Xác nhận đã thanh toán
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER: Chỉ hiện ở bước 1 */}
        {step === 1 && (
          <div className="p-8 md:px-16 bg-[#0f0f0f] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Đã chọn:</span>
                 <div className="flex gap-2">
                    {selectedSeats.length > 0 ? selectedSeats.map(s => (
                      <span key={s.seatLabel} className="text-red-500 font-black italic text-lg">{s.seatLabel}</span>
                    )) : <span className="text-zinc-700 italic text-sm italic">Chưa có ghế...</span>}
                 </div>
              </div>
              <div className="text-4xl font-[1000] text-white italic tracking-tighter">
                {totalAmount.toLocaleString()} <span className="text-zinc-500 text-[10px] uppercase ml-1">VNĐ</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {selectedSeats.length > 0 && (
                <div className="flex flex-col items-end px-6 border-r border-white/5">
                  <p className="text-[9px] text-zinc-400 font-bold uppercase mb-1">Giữ chỗ còn</p>
                  <div className="text-red-600 font-mono font-bold text-xl flex items-center gap-2">
                    <Clock size={16} /> <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>
              )}
              <button 
                onClick={() => setStep(2)} 
                disabled={selectedSeats.length === 0}
                className="px-16 py-5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-2xl font-[1000] uppercase text-[11px] tracking-[0.4em] transition-all transform active:scale-95"
              >
                Đặt vé ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SuccessOverlay = () => (
  <div className="absolute inset-0 z-[120] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-700">
    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
      <Check size={48} className="text-white stroke-[4]" />
    </div>
    <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-widest">Thanh toán thành công!</h2>
    <p className="text-zinc-500 text-xs mt-4 uppercase font-bold tracking-widest">Vui lòng kiểm tra email nhận vé</p>
  </div>
);