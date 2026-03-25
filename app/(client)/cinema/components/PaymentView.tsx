"use client";
import React from 'react';
import { ChevronLeft, Loader2, ShieldCheck } from 'lucide-react';

const PaymentView = ({ info, selectedSeats, totalPrice, paymentMethod, setPaymentMethod, onBack, onConfirm, loading }: any) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PAY_CINEMA_${totalPrice}`;

  return (
    <div className="flex h-full bg-[#0a0a0a] animate-in slide-in-from-right">
      <div className="flex-[0.45] p-10 border-r border-dashed border-white/5 bg-gradient-to-b from-red-950/10">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-[9px] font-black uppercase text-zinc-500 hover:text-white transition-all"><ChevronLeft size={14}/> Quay lại</button>
        <h2 className="text-3xl font-[1000] text-white uppercase italic leading-none mb-4">{info.title}</h2>
        <div className="py-6 border-y border-white/5 space-y-4">
          <div><p className="text-[8px] text-zinc-600 uppercase font-black">Ghế</p><p className="text-xl font-black text-red-600 italic">{selectedSeats.join(', ')}</p></div>
          <div><p className="text-[8px] text-zinc-600 uppercase font-black">Tổng tiền</p><p className="text-3xl font-black text-white italic">{totalPrice.toLocaleString()} <span className="text-xs">VND</span></p></div>
        </div>
        <p className="mt-4 flex items-center gap-2 text-[8px] text-zinc-600 font-bold uppercase"><ShieldCheck size={12} className="text-green-800" /> Thanh toán bảo mật</p>
      </div>

      <div className="flex-1 p-10 flex flex-col items-center justify-center bg-[#070707]">
        <div className="flex gap-4 mb-8 w-64">
          {['momo', 'vnpay'].map(m => (
            <button key={m} onClick={() => setPaymentMethod(m)} className={`flex-1 py-3 rounded-xl border text-[9px] font-black uppercase ${paymentMethod === m ? 'bg-red-600 border-red-500 text-white' : 'border-white/5 text-zinc-600'}`}>{m}</button>
          ))}
        </div>
        <div className="relative p-4 bg-white rounded-[2.5rem] mb-8">
           <img src={qrUrl} className={`w-40 h-40 ${loading ? 'blur-sm' : ''}`} alt="QR" />
           {loading && <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-[2.5rem]"><Loader2 className="animate-spin text-red-600" /></div>}
        </div>
        <button onClick={onConfirm} disabled={loading} className="w-64 py-4 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">
          {loading ? "Đang xử lý..." : "Xác nhận đã chuyển khoản"}
        </button>
      </div>
    </div>
  );
};
export default PaymentView;