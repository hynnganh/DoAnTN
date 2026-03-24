import React from 'react';
import { ChevronLeft, Loader2, CreditCard } from 'lucide-react';

const PaymentView = ({ info, selectedSeats, totalPrice, paymentMethod, setPaymentMethod, paymentData, onBack, onConfirm, loading }: any) => {
  const qrUrl = paymentData?.paymentUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PENDING_${totalPrice}`;

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full animate-in zoom-in-95 duration-500 bg-[#0a0a0a]">
      {/* Cột trái: Thông tin hóa đơn */}
      <div className="flex-[0.7] p-10 border-r border-dashed border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
        <button onClick={onBack} disabled={loading} className="mb-10 flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-red-500 transition-all tracking-widest group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Quay lại sơ đồ
        </button>
        
        <div className="space-y-8 text-white">
          <div className="flex items-center gap-4">
            <span className="bg-red-600 text-[10px] font-black px-3 py-1.5 rounded-lg">T18</span>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">{info.title}</h2>
          </div>
          
          <div className="space-y-4 pt-8 border-t border-white/5">
            <div className="flex justify-between">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Ghế đã chọn</p>
              <p className="text-xl font-black text-red-600 italic tracking-tighter">{selectedSeats.join(", ")}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Phòng chiếu</p>
              <p className="text-sm font-bold text-white/80">{info.roomName || "Phòng 01"}</p>
            </div>
          </div>

          <div className="p-8 mt-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 shadow-inner">
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-2">Tổng thanh toán</p>
            <div className="flex items-baseline gap-1">
              <p className="text-5xl font-black text-white tracking-tighter italic">{totalPrice.toLocaleString()}</p>
              <span className="text-lg font-black text-red-600 italic">VNĐ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: QR & Thanh toán */}
      <div className="flex-1 p-10 flex flex-col items-center justify-center bg-[#080808]">
        <div className="grid grid-cols-2 gap-3 mb-10 w-full max-w-xs">
          {['momo', 'vnpay'].map(m => (
            <button key={m} onClick={() => setPaymentMethod(m)} disabled={!!paymentData}
              className={`py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest
              ${paymentMethod === m ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500'}`}>
              {m}
            </button>
          ))}
        </div>

        <div className="bg-white p-5 rounded-[2.5rem] mb-10 shadow-2xl relative group">
          <img src={qrUrl} className={`w-44 h-44 transition-all duration-700 ${loading ? 'blur-md opacity-20' : ''}`} alt="QR" />
          {loading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={32} /></div>}
        </div>

        <button onClick={onConfirm} disabled={loading}
          className="w-full max-w-xs py-6 rounded-full bg-red-600 text-white font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl hover:bg-red-500 active:scale-95 transition-all disabled:bg-zinc-900 disabled:text-zinc-600">
          {loading ? "Đang xử lý..." : (paymentData ? "Tôi đã chuyển khoản xong" : "Xác nhận & Lấy mã QR")}
        </button>
      </div>
    </div>
  );
};
export default PaymentView;