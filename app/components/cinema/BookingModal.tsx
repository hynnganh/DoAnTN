"use client";
import React, { useState, useCallback } from 'react';
import { X, Ticket, Check, Loader2 } from 'lucide-react';
import SeatMap from './SeatMap';
import PaymentView from './PaymentView';

const SuccessOverlay = () => (
  <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-1000">
    <div className="text-center space-y-8 animate-in zoom-in-95 slide-in-from-bottom-10 duration-1000 ease-out">
      {/* Biểu tượng Checkmark với hiệu ứng Lân Quang */}
      <div className="relative mx-auto w-28 h-28">
        <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping duration-[2000ms]"></div>
        <div className="relative w-28 h-28 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.5)] border-4 border-white/20">
          <Check size={56} className="text-white stroke-[4] animate-in zoom-in duration-500 delay-500" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Thanh toán xong!</h2>
        <p className="text-zinc-400 font-medium tracking-wide text-sm max-w-[250px] mx-auto opacity-80">
          Vé của bạn đã được xác nhận. Vui lòng kiểm tra trong mục vé của tôi.
        </p>
      </div>

      <div className="pt-10 flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className="w-2 h-2 bg-red-600 rounded-full animate-bounce" 
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
        <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] animate-pulse">
          Đang hoàn tất
        </p>
      </div>
    </div>
  </div>
);

const BookingModal = ({ info, onClose }: any) => {
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('momo');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cấu hình sơ đồ
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const seatsPerRow = 16;
  const pricePerSeat = 165000;
  const totalPrice = selectedSeats.length * pricePerSeat;

  const handleToggleSeat = (id: string) => {
    setSelectedSeats(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleConfirmPayment = () => {
    setLoading(true);
    // Giả lập thời gian xử lý ngân hàng
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      // Đóng modal sau khi hiện thông báo thành công 3 giây
      setTimeout(() => onClose(), 3500);
    }, 2000);
  };

  if (!info) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 md:p-6 overflow-hidden">
      {/* Backdrop nền */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity duration-700" onClick={onClose}></div>
      
      {/* Main Container */}
      <div className="relative z-10 bg-[#050505] w-full max-w-6xl h-full md:h-[92vh] md:rounded-[4rem] border-t md:border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Render thông báo thành công nếu có */}
        {isSuccess && <SuccessOverlay />}

        {/* --- STEP 1: CHỌN GHẾ --- */}
        {step === 1 && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="p-8 flex justify-between items-center px-12 border-b border-white/5 bg-[#050505] z-30">
              <div className="flex items-center gap-5 text-white">
                <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                  <Ticket size={24}/>
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter leading-none">{info.title}</h2>
                  <p className="text-[9px] text-gray-500 font-black mt-2 italic tracking-widest uppercase">
                    Cinema IMAX • {info.time}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white transition-all border border-white/5"
              >
                <X size={20}/>
              </button>
            </div>

            {/* Sơ đồ ghế (Component tách rời) */}
            <SeatMap 
              rows={rows} 
              seatsPerRow={seatsPerRow} 
              selectedSeats={selectedSeats} 
              onToggleSeat={handleToggleSeat} 
              onUpdate={() => {}} // Pass thực tế nếu cần logic từ pinch-zoom
            />

            {/* Footer Step 1 */}
            <div className="p-8 bg-[#080808] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 px-16 shrink-0 z-30 shadow-[0_-15px_40px_rgba(0,0,0,0.5)]">
              <div className="flex gap-12 text-white">
                <div>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 opacity-50 italic">Ghế chọn</p>
                  <p className="text-xl font-black">{selectedSeats.join(", ") || "---"}</p>
                </div>
                <div className="w-[1px] h-10 bg-white/10 hidden md:block"></div>
                <div>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 opacity-50 italic">Tổng tiền</p>
                  <p className="text-2xl font-black text-red-600 tracking-tighter">{totalPrice.toLocaleString()}đ</p>
                </div>
              </div>
              
              <button 
                onClick={() => setStep(2)} 
                disabled={selectedSeats.length === 0} 
                className={`w-full md:w-auto px-20 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.4em] transition-all shadow-2xl ${
                  selectedSeats.length > 0 
                    ? 'bg-red-600 text-white hover:bg-red-500 shadow-red-600/30 active:scale-95' 
                    : 'bg-white/5 text-white/10 cursor-not-allowed'
                }`}
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: THANH TOÁN --- */}
        {step === 2 && (
          <div className="flex-1 flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out">
            <PaymentView 
              info={info} 
              selectedSeats={selectedSeats} 
              totalPrice={totalPrice} 
              paymentMethod={paymentMethod} 
              setPaymentMethod={setPaymentMethod} 
              onBack={() => !loading && setStep(1)} 
              onConfirm={handleConfirmPayment} 
              loading={loading} 
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default BookingModal;