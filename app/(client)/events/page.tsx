"use client";
import React, { useState, useEffect } from 'react';
import { Tag, ChevronRight, Timer, Sparkles, Ticket, Loader2, Copy, Check } from 'lucide-react';
import { apiRequest } from '@/app/lib/api';
import toast, { Toaster } from 'react-hot-toast';

// --- Tách riêng cái này để không bị tick chùm ---
const VoucherCard = ({ promo }: { promo: any }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    toast.success(`Đã sao chép mã: ${code}`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="group relative bg-[#0a0a0a] rounded-[3rem] border border-white/5 overflow-hidden transition-all duration-700 hover:border-red-600/50 hover:shadow-[0_30px_60px_-15px_rgba(220,38,38,0.2)]">
      {/* Image Decor */}
      <div className="relative h-[250px] overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Tag size={120} className="text-white rotate-12" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        
        {/* Discount Badge */}
        <div className="absolute top-8 left-8 px-5 py-2 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-[11px] font-[1000] uppercase tracking-widest shadow-xl text-white">
          Giảm {promo.discountPercentage}%
        </div>
      </div>

      {/* Content */}
      <div className="p-8 -mt-10 relative z-10 space-y-4">
        <div className="flex items-center gap-2 text-red-500 text-[9px] font-black uppercase tracking-[0.2em]">
          <Timer size={12} /> Hết hạn: {new Date(promo.endTime).toLocaleDateString('vi-VN')}
        </div>
        <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight group-hover:text-red-500 transition-colors text-white">
          {promo.title}
        </h3>
        <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
          {promo.description}
        </p>
        
        {/* PHẦN LẤY MÃ VOUCHER */}
        <div className="pt-4 mt-4 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-dashed border-zinc-700 group-hover:border-red-600/50 transition-colors">
            <div>
              <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Promo Code</p>
              <p className="text-lg font-black tracking-[0.2em] text-white uppercase">{promo.code}</p>
            </div>
            <button 
              onClick={() => handleCopy(promo.code)}
              className="p-3 bg-white/5 hover:bg-red-600 rounded-xl transition-all text-white"
            >
              {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>
          
          <button className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all active:scale-95">
            Đặt vé ngay <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EventsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const resUser = await apiRequest('/api/v1/users/me');
        const user = await resUser.json();
        const cinemaId = user.data?.managedCinemaItemId;
        const endpoint = cinemaId ? `/api/v1/promotions/client/${cinemaId}` : '/api/v1/promotions';

        const res = await apiRequest(endpoint);
        const result = await res.json();
        if (result.data) setPromotions(result.data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Đang săn deal cực hot...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden pt-10 pb-20">
      <Toaster position="bottom-center" />
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-red-500">
            <Sparkles size={12} fill="currentColor" /> Khám phá ưu đãi
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.8] mb-2 text-white">
            Voucher <br/> <span className="text-red-600">Hot</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <VoucherCard key={promo.id} promo={promo} />
          ))}
        </div>

        {promotions.length === 0 && (
          <div className="py-40 text-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Hiện tại chưa có mã giảm giá nào</p>
          </div>
        )}
      </div>
    </div>
  );
}