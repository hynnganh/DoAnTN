"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, HandCoins, Loader2, Sparkles } from 'lucide-react';

export default function ComboDealsSection() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/combos');
        const resData = await res.json();
        if (res.ok) setCombos(resData.data || []);
      } catch (error) {
        console.error("Lỗi lấy combo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCombos();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getGlowEffect = (index: number) => {
    const effects = [
      { glow: "group-hover:shadow-[0_0_40px_rgba(220,38,38,0.25)]", accent: "text-red-500", bg: "from-red-950/20", border: "group-hover:border-red-500/30" },
      { glow: "group-hover:shadow-[0_0_40px_rgba(250,204,21,0.2)]", accent: "text-amber-400", bg: "from-amber-950/20", border: "group-hover:border-amber-500/30" },
      { glow: "group-hover:shadow-[0_0_40px_rgba(56,189,248,0.2)]", accent: "text-sky-400", bg: "from-sky-950/20", border: "group-hover:border-sky-500/30" }
    ];
    return effects[index % effects.length];
  };

  if (loading) return (
    <div className="py-40 flex flex-col items-center gap-4 bg-[#050505]">
      <Loader2 className="animate-spin text-red-600" size={40} />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Đang chuẩn bị thực đơn...</span>
    </div>
  );

  return (
    <section className="bg-[#050505] py-24 px-6 overflow-hidden">
      <div className="max-w-[1300px] mx-auto space-y-16">
        
        {/* --- HEADER CAO CẤP --- */}
        <div className="relative space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-zinc-900/50 border border-white/5 rounded-full backdrop-blur-md">
            <Sparkles size={14} className="text-red-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Độc quyền tại A&K Cinema</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="text-6xl md:text-8xl font-[1000] italic uppercase tracking-tighter text-white leading-[0.8]">
              Combo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Thượng Hạng</span>
            </h2>
            <p className="max-w-xs text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
              Trải nghiệm điện ảnh trọn vẹn với thực đơn bắp nước đa dạng, chế biến tươi mới mỗi ngày.
            </p>
          </div>
        </div>

        {/* --- GRID CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {combos.map((item, index) => {
            const ui = getGlowEffect(index);
            return (
              <div 
                key={item.id} 
                className={`group relative rounded-[2.5rem] bg-zinc-900/30 border border-white/5 p-1 transition-all duration-500 hover:scale-[1.02] ${ui.glow}`}
              >
                {/* Background Decor */}
                <div className={`absolute inset-0 bg-gradient-to-br ${ui.bg} to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[2.5rem]`} />
                
                <div className={`relative h-full bg-[#0c0c0e] rounded-[2.4rem] border border-transparent transition-all duration-500 ${ui.border} p-8 flex flex-col justify-between overflow-hidden`}>
                  
                  {/* Image & Tag Section */}
                  <div className="relative space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="relative w-20 h-20">
                        <div className={`absolute inset-0 ${ui.accent} blur-2xl opacity-20 group-hover:opacity-40 transition-all`} />
                        <div className="relative w-full h-full bg-black rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
                          ) : (
                            <ShoppingBag className={ui.accent} size={32} />
                          )}
                        </div>
                      </div>
                      <span className="px-4 py-1.5 bg-zinc-900/80 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400 backdrop-blur-md">
                        {item.price > 150000 ? "Popular" : "Save 15%"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-3xl font-[1000] italic text-white uppercase tracking-tighter group-hover:text-red-500 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-loose line-clamp-2 italic">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="mt-12 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Giá thanh toán</span>
                      <span className="text-4xl font-[1000] text-white italic tracking-tighter leading-none">
                        {formatPrice(item.price)}
                        <span className="text-[10px] ml-1 text-red-600 uppercase not-italic font-black">vnđ</span>
                      </span>
                    </div>
                    
                    <button className="relative h-16 w-16 group/btn overflow-hidden rounded-2xl bg-white text-black transition-all duration-300 hover:bg-red-600 hover:text-white active:scale-90 shadow-2xl">
                        <div className="absolute inset-0 bg-red-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                        <Plus size={28} strokeWidth={3} className="relative z-10 mx-auto" />
                    </button>
                  </div>

                  {/* Watermark Background */}
                  <div className="absolute -bottom-4 -right-2 text-[80px] font-[1000] italic text-white/[0.02] select-none pointer-events-none group-hover:text-white/[0.04] transition-all">
                    COMBO
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}