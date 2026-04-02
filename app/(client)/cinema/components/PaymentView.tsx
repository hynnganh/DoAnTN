"use client";
import React from 'react';
import { ChevronLeft, Loader2, ShieldCheck } from 'lucide-react';

interface PaymentViewProps {
  info: any;
  selectedSeats: string[];
  totalPrice: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const PaymentView = ({ info, selectedSeats, totalPrice, paymentMethod, setPaymentMethod, onBack, onConfirm, loading }: PaymentViewProps) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PAY_NGOCANH_${totalPrice}`;

  return (
    <div className="flex h-full bg-[#0a0a0a] animate-in slide-in-from-right">
      <div className="flex-[0.4] p-10 border-r border-white/5 bg-red-950/5">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft size={14}/> Quay lại
        </button>
        <h2 className="text-3xl font-black text-white uppercase italic mb-6">{info.title}</h2>
        <div className="space-y-6">
          <div>
            <p className="text-[10px] text-zinc-600 uppercase font-black">Ghế đã chọn</p>
            <p className="text-2xl font-black text-red-600 italic">{selectedSeats.join(', ')}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600 uppercase font-black">Thành tiền</p>
            <p className="text-4xl font-black text-white italic">{totalPrice.toLocaleString()} VND</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-10 flex flex-col items-center justify-center">
        <div className="flex gap-4 mb-10">
          {['momo', 'vnpay'].map(m => (
            <button 
              key={m} 
              onClick={() => setPaymentMethod(m)} 
              className={`px-10 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${paymentMethod === m ? 'bg-red-600 border-red-500 text-white' : 'border-white/5 text-zinc-600 hover:border-white/20'}`}
            >
              {m}
            </button>
          ))}
        </div>
        
        <div className="relative p-6 bg-white rounded-[3rem] mb-10">
           <img src={qrUrl} className={`w-44 h-44 transition-all ${loading ? 'blur-md opacity-50' : ''}`} alt="QR" />
           {loading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={32} /></div>}
        </div>
        
        <button 
          onClick={onConfirm} 
          disabled={loading} 
          className="w-72 py-5 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all"
        >
          {loading ? "Đang xử lý..." : "Xác nhận đã chuyển khoản"}
        </button>
        <p className="mt-6 flex items-center gap-2 text-[10px] text-zinc-700 font-bold uppercase">
          <ShieldCheck size={14} /> Giao dịch bảo mật 256-bit
        </p>
      </div>
    </div>
  );
};
export default PaymentView;