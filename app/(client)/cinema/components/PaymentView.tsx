"use client";
import React from 'react';
import { ChevronLeft, Loader2, ShieldCheck, CreditCard } from 'lucide-react';

const PaymentView = ({ info, selectedSeats, totalPrice, paymentMethod, setPaymentMethod, onBack, onConfirm, loading }: any) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=AK_CINEMA_${totalPrice}_${selectedSeats.join('_')}`;

  return (
    <div className="flex flex-col md:flex-row h-full bg-[#050505] animate-in slide-in-from-right duration-500">
      {/* Tóm tắt đơn hàng */}
      <div className="flex-[0.4] p-12 border-r border-white/5 bg-zinc-950/20">
        <button onClick={onBack} className="mb-10 flex items-center gap-2 text-[9px] font-[1000] uppercase text-zinc-600 hover:text-white transition-all">
          <ChevronLeft size={14}/> Quay lại chọn ghế
        </button>
        
        <div className="space-y-10">
          <div>
            <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest mb-3">Phim đã chọn</p>
            <h2 className="text-3xl font-[1000] text-white uppercase italic leading-none">{info.title}</h2>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest mb-2">Số ghế</p>
              <p className="text-2xl font-[1000] text-red-600 italic tracking-tighter">{selectedSeats.join(', ')}</p>
            </div>
            <div>
              <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest mb-2">Suất chiếu</p>
              <p className="text-lg font-bold text-white uppercase">{info.time}</p>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5">
            <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest mb-2">Tổng số tiền</p>
            <p className="text-5xl font-[1000] text-white italic tracking-tighter leading-none">{totalPrice.toLocaleString()} <span className="text-sm text-red-600 uppercase">VND</span></p>
          </div>
        </div>
      </div>

      {/* Khu vực QR & Thanh toán */}
      <div className="flex-1 p-12 flex flex-col items-center justify-center bg-black">
        <div className="flex gap-4 mb-12">
          {['momo', 'vnpay'].map(m => (
            <button 
              key={m} 
              onClick={() => setPaymentMethod(m)} 
              className={`px-12 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all ${paymentMethod === m ? 'bg-white border-white text-black' : 'border-white/10 text-zinc-600 hover:border-white/30'}`}
            >
              {m}
            </button>
          ))}
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-4 bg-red-600/20 rounded-[4rem] blur-2xl group-hover:bg-red-600/30 transition-all"></div>
          <div className="relative p-8 bg-white rounded-[3rem] shadow-2xl">
             <img src={qrUrl} className={`w-48 h-48 transition-all duration-500 ${loading ? 'blur-md opacity-30' : 'grayscale hover:grayscale-0'}`} alt="QR Payment" />
             {loading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>}
          </div>
        </div>

        <div className="mt-12 space-y-6 text-center">
          <button 
            onClick={onConfirm} 
            disabled={loading} 
            className="w-80 py-6 bg-red-600 hover:bg-red-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-2xl font-[1000] uppercase text-[11px] tracking-[0.4em] shadow-[0_20px_50px_rgba(220,38,38,0.3)] active:scale-95 transition-all"
          >
            {loading ? "Đang xử lý giao dịch..." : "Tôi đã chuyển khoản"}
          </button>
          
          <div className="flex items-center justify-center gap-6 opacity-20">
             <ShieldCheck size={16} className="text-white" />
             <CreditCard size={16} className="text-white" />
             <p className="text-[8px] text-white font-black uppercase tracking-widest">Giao dịch an toàn mã hóa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;