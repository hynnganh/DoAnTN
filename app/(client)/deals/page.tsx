"use client";
import React from 'react';
import { Ticket, Zap, ChevronRight, ShoppingBag, Star, Flame, Plus, Sparkles, HandCoins } from 'lucide-react';

const COMBO_DEALS = [
  {
    id: 1,
    name: "Combo Đơn Thân",
    desc: "1 Bắp lớn + 1 Nước ngọt (L) + 1 Snack",
    price: "85.000",
    oldPrice: "110.000",
    tag: "Phổ biến",
    // Hiệu ứng Glow Đỏ đặc trưng của rạp
    glow: "group-hover:shadow-[0_0_30px_10px_rgba(220,38,38,0.2)]",
    iconColor: "text-red-500",
    bgColor: "group-hover:bg-red-950/20"
  },
  {
    id: 2,
    name: "Combo Cặp Đôi",
    desc: "1 Bắp khổng lồ + 2 Nước ngọt (L) + 1 Kẹo",
    price: "145.000",
    oldPrice: "195.000",
    tag: "Tiết kiệm 25%",
    // Hiệu ứng Glow Vàng chanh kích thích vị giác
    glow: "group-hover:shadow-[0_0_30px_10px_rgba(250,204,21,0.15)]",
    iconColor: "text-amber-400",
    bgColor: "group-hover:bg-amber-950/20"
  },
  {
    id: 3,
    name: "Party Family",
    desc: "2 Bắp lớn + 4 Nước + 2 Xúc xích",
    price: "280.000",
    oldPrice: "350.000",
    tag: "Ưu đãi lớn nhất",
    // Hiệu ứng Glow Xanh Neon hiện đại
    glow: "group-hover:shadow-[0_0_30px_10px_rgba(56,189,248,0.15)]",
    iconColor: "text-sky-400",
    bgColor: "group-hover:bg-sky-950/20"
  }
];

export default function ComboDealsSection() {
  return (
    // Nền đen huyền bí (#0a0a0c) đồng bộ
    <section className="bg-[#0a0a0c] py-20 px-6 max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000">
      
      {/* --- TIÊU ĐỀ (BO TRÒN & CÓ ĐỘ SÂU) --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-zinc-900 border border-white/5 rounded-full shadow-inner">
            <HandCoins size={14} className="text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Chương trình ưu đãi</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter text-white leading-none">
            Combo <span className="text-red-600">Thượng Hạng</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-lg">Đặt kèm vé ngay để nhận chiết khấu lên đến 30% tại quầy</p>
        </div>
        
        <button className="group flex items-center gap-2.5 px-6 py-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:border-white/10 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg">
          Thực đơn đầy đủ <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

      {/* --- GRID DEALS (SIÊU BO TRÒN & HIỆU ỨNG ÁNH SÁNG) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {COMBO_DEALS.map((item) => (
          <div 
            key={item.id}
            // Nền đen đậm (#0c0c0e), bo tròn sâu (rounded-[3rem]), transition mượt
            className={`group relative overflow-hidden rounded-[3rem] border border-white/5 bg-[#0c0c0e] p-9 transition-all duration-700 ${item.glow} hover:-translate-y-2`}
          >
            {/* Lớp màu nền mờ khi Hover */}
            <div className={`absolute inset-0 ${item.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            
            {/* Ambient Light chìm */}
            <div className={`absolute -bottom-20 -right-20 w-40 h-40 ${item.iconColor.split('-')[1] === 'red' ? 'bg-red-600/5' : 'bg-amber-600/5'} blur-[60px] rounded-full group-hover:blur-[80px] transition-all`} />

            <div className="relative z-10 space-y-10">
              {/* Phần đầu: Icon & Tag */}
              <div className="flex justify-between items-start">
                <div className={`w-16 h-16 rounded-3xl bg-black flex items-center justify-center ${item.iconColor} shadow-inner border border-white/[0.03] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <ShoppingBag size={32} strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-zinc-400">
                  <Star size={10} className="fill-current text-zinc-600" />
                  {item.tag}
                </div>
              </div>

              {/* Phần thông tin: Tên & Mô tả */}
              <div className="space-y-3">
                <h4 className="text-3xl font-[1000] italic text-white uppercase tracking-tighter leading-none">{item.name}</h4>
                <p className="text-zinc-600 text-[11px] leading-relaxed font-bold uppercase tracking-wide italic">{item.desc}</p>
              </div>

              {/* Phần giá & Nút thêm: Tương phản cao */}
              <div className="flex items-end justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-zinc-700 text-xs line-through font-bold tracking-tight">{item.oldPrice}đ</span>
                  <span className="text-4xl font-[1000] text-white italic tracking-tighter leading-none mt-1">
                    {item.price}<span className="text-sm ml-1 text-zinc-400 font-medium">đ</span>
                  </span>
                </div>
                
                {/* Nút Trắng trên nền Đen: Nổi bật, bo tròn full */}
                <button className="h-14 w-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-[0_10px_30px_-5px_rgba(255,255,255,0.15)] active:scale-90 group-hover:shadow-[0_10px_30px_-5px_rgba(220,38,38,0.3)]">
                  <Plus size={24} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Chữ DEALS rỗng (decor chìm) */}
            <div className="stroke-text absolute bottom-2 left-6 text-white font-[1000] text-7xl italic select-none pointer-events-none group-hover:translate-x-1 group-hover:stroke-text-red transition-all duration-700">
              DEALS
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}