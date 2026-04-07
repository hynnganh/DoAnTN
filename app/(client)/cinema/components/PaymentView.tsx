"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Loader2, ShieldCheck, Wallet, CreditCard, Ticket } from 'lucide-react';

interface PaymentViewProps {
  info: any;
  selectedSeats: string[];
  totalPrice: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
  qrContent: string;
}

const PaymentView = ({ 
  info, selectedSeats, totalPrice, paymentMethod, 
  setPaymentMethod, onBack, onConfirm, loading, qrContent 
}: PaymentViewProps) => {
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrContent || 'PENDING')}`;

  return (
    <div className="h-full bg-[#050505] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-700">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-4xl w-full flex flex-col md:flex-row bg-zinc-950/40 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-2xl shadow-2xl">
        
        {/* CỘT TRÁI: Tóm tắt đơn hàng (Nhỏ nhắn hơn) */}
        <div className="md:w-[380px] p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.01]">
          <button 
            onClick={onBack} 
            className="mb-8 flex items-center gap-2 text-[9px] font-black uppercase text-zinc-600 hover:text-red-500 transition-all tracking-[0.2em]"
          >
            <ChevronLeft size={12}/> Trở lại
          </button>

          <div className="space-y-1">
            <p className="text-[10px] text-red-600 font-black uppercase tracking-[0.3em] mb-2">Booking Summary</p>
            <h2 className="text-2xl font-[1000] text-white uppercase italic leading-tight tracking-tighter mb-8">
              {info.title}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="group bg-white/5 p-5 rounded-2xl border border-white/5 transition-all hover:bg-white/[0.08]">
              <p className="text-[8px] text-zinc-500 uppercase font-black mb-3 tracking-widest flex items-center gap-2">
                <Ticket size={10}/> Vị trí ghế
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map(s => (
                  <span key={s} className="text-xl font-[1000] text-white italic tracking-tighter">{s}</span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="text-[8px] text-zinc-500 uppercase font-black mb-1 tracking-widest">Tổng thanh toán</p>
              <p className="text-3xl font-[1000] text-red-600 italic tracking-tighter leading-none">
                {totalPrice.toLocaleString()} 
                <span className="text-[10px] text-zinc-500 ml-1 not-italic font-bold">VND</span>
              </p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Thanh toán (Thoáng đãng) */}
        <div className="flex-1 p-8 md:p-10 flex flex-col items-center justify-center bg-gradient-to-br from-transparent to-red-950/10">
          
          {/* Tabs phương thức thanh toán */}
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5 mb-10 w-full max-w-[300px]">
            {['momo', 'vnpay'].map(m => (
              <button 
                key={m} 
                onClick={() => setPaymentMethod(m)} 
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all duration-500 ${
                  paymentMethod === m 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                  : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {m === 'momo' ? <Wallet size={12}/> : <CreditCard size={12}/>}
                {m}
              </button>
            ))}
          </div>

          {/* QR Area */}
          <div className="relative mb-10 group">
            <div className="absolute -inset-4 bg-white/5 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative p-5 bg-white rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-105">
              <img 
                src={qrUrl} 
                className={`w-36 h-36 md:w-40 md:h-40 transition-all duration-500 ${loading ? 'blur-md opacity-20' : 'opacity-100'}`} 
                alt="Payment QR" 
              />
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-red-600" size={32} />
                </div>
              )}
            </div>
          </div>

          <div className="w-full max-w-[320px] flex flex-col items-center gap-5">
            <button 
              onClick={onConfirm} 
              disabled={loading} 
              className="w-full py-4 bg-white hover:bg-red-600 text-black hover:text-white rounded-2xl font-[1000] uppercase text-[10px] tracking-[0.3em] transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Đang xác thực..." : "Tôi đã chuyển khoản"}
            </button>

            <div className="flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity">
              <ShieldCheck size={14} className="text-green-500" />
              <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.2em]">Encrypted by Admin System</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;