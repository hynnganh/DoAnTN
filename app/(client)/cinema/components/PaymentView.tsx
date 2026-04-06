"use client";
import React, { useState, useEffect } from 'react';
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
  qrContent: string;
}

const PaymentView = ({ 
  info, 
  selectedSeats, 
  totalPrice, 
  paymentMethod, 
  setPaymentMethod, 
  onBack, 
  onConfirm, 
  loading,
  qrContent 
}: PaymentViewProps) => {
  
  // --- 1. Fix Hydration (Way 1) ---
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Xử lý mã QR
  const displayData = qrContent || `PAY_ORDER_PENDING_${totalPrice}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(displayData)}`;

  return (
    <div className="flex h-full bg-[#0a0a0a] animate-in slide-in-from-right duration-500">
      {/* Cột trái: Tóm tắt đơn hàng */}
      <div className="flex-[0.4] p-10 border-r border-white/5 bg-red-950/5">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft size={14}/> Quay lại chọn ghế
        </button>
        <h2 className="text-3xl font-black text-white uppercase italic mb-8 leading-tight">{info.title}</h2>
        <div className="space-y-8">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <p className="text-[10px] text-zinc-600 uppercase font-black mb-2 tracking-widest">Ghế đã chọn</p>
            <p className="text-3xl font-black text-red-600 italic tracking-tighter">{selectedSeats.join(', ')}</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <p className="text-[10px] text-zinc-600 uppercase font-black mb-2 tracking-widest">Thành tiền</p>
            <p className="text-4xl font-black text-white italic tracking-tighter">{totalPrice.toLocaleString()} <span className="text-sm">VND</span></p>
          </div>
        </div>
      </div>

      {/* Cột phải: Quét mã QR */}
      <div className="flex-1 p-10 flex flex-col items-center justify-center">
        {/* Lựa chọn phương thức */}
        <div className="flex gap-4 mb-12">
          {['momo', 'vnpay'].map(m => (
            <button 
              key={m} 
              onClick={() => setPaymentMethod(m)} 
              className={`px-12 py-4 rounded-2xl border text-[10px] font-black uppercase transition-all duration-300 ${
                paymentMethod === m 
                ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30' 
                : 'border-white/5 text-zinc-600 hover:border-white/20'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        
        {/* Khu vực mã QR */}
        <div className="relative group">
           <div className="absolute -inset-2 bg-red-600/10 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
           <div className="relative p-8 bg-white rounded-[3rem] mb-12 shadow-2xl">
              <img 
                src={qrUrl} 
                className={`w-48 h-48 transition-all duration-500 ${loading ? 'blur-md opacity-50' : 'opacity-100'}`} 
                alt="Mã QR Thanh Toán" 
              />
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="animate-spin text-red-600" size={40} />
                  <span className="text-[8px] font-black text-red-600 uppercase">Đang xử lý...</span>
                </div>
              )}
           </div>
        </div>
        
        {/* Nút xác nhận */}
        <div className="flex flex-col items-center gap-6">
            <button 
              onClick={onConfirm} 
              disabled={loading} 
              className="w-80 py-6 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-3xl font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
            >
              {loading ? "Đang xác nhận..." : "Xác nhận đã chuyển khoản"}
            </button>
            
            <p className="flex items-center gap-3 text-[10px] text-zinc-700 font-bold uppercase tracking-widest">
              <ShieldCheck size={16} className="text-green-500" /> Giao dịch được bảo mật 256-bit
            </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;
