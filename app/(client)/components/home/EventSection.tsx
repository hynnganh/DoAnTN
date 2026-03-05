"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Flame, Crown, Ticket, Sparkles } from "lucide-react";

const EVENTS = [
  {
    id: "thu-4-vui-ve",
    title: "Thứ 4 Vui Vẻ",
    desc: "Giá vé đồng giá chỉ từ 50.000đ cho mọi suất chiếu nội địa.",
    tag: "Ưu Đãi Hot",
    color: "group-hover:shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]",
    gradient: "from-red-600/80 via-black/40 to-transparent",
    icon: <Flame size={24} className="text-orange-500" />,
    img: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600",
  },
  {
    id: "thanh-vien-vip",
    title: "Thành Viên VIP",
    desc: "Giảm ngay 10% và tích điểm đổi bắp nước miễn phí mỗi ngày.",
    tag: "Đặc Quyền",
    color: "group-hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.4)]",
    gradient: "from-amber-600/80 via-black/40 to-transparent",
    icon: <Crown size={24} className="text-yellow-400" />,
    img: "https://images.unsplash.com/photo-1517604401157-538a9663ecb4?q=80&w=600",
  },
  {
    id: "combo-cap-doi",
    title: "Combo Cặp Đôi",
    desc: "Bắp lớn + 2 Nước ngọt chỉ 89k khi đặt kèm vé trực tuyến.",
    tag: "Bán Chạy",
    color: "group-hover:shadow-[0_0_40px_-10px_rgba(14,165,233,0.4)]",
    gradient: "from-blue-600/80 via-black/40 to-transparent",
    icon: <Ticket size={24} className="text-cyan-400" />,
    img: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=600",
  },
];

export default function EventSection() {
  return (
    <section className="px-6 md:px-12 py-24 bg-[#0a0a0c] animate-in fade-in duration-1000">
      {/* --- HEADER (BO TRÒN & TINH TẾ) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div className="flex items-center gap-6">
          <div className="w-1.5 h-16 bg-red-600 rounded-full shadow-[0_0_25px_rgba(220,38,38,0.6)]" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-red-500 animate-pulse" />
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">
                Exclusive Deals
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-[1000] text-white tracking-tighter uppercase leading-none italic">
              Sự Kiện & <span className="text-red-600">Ưu Đãi</span>
            </h2>
          </div>
        </div>
        
        <Link 
          href="/uu-dai"
          className="group flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-400 font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-white/10 transition-all shadow-xl"
        >
          Xem tất cả <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>

      {/* --- GRID EVENTS (CLICKABLE) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {EVENTS.map((event) => (
          <Link
            key={event.id}
            href={`/uu-dai/${event.id}`}
            className={`group relative h-[450px] rounded-[3rem] overflow-hidden border border-white/5 bg-[#0c0c0e] transition-all duration-700 shadow-2xl ${event.color} hover:-translate-y-2`}
          >
            {/* Ảnh nền với Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
              <img 
                src={event.img} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 blur-[0.5px] group-hover:blur-0 opacity-60 group-hover:opacity-80" 
                alt={event.title}
              />
            </div>
            
            {/* Overlay Gradient cực mạnh để text luôn rõ */}
            <div className={`absolute inset-0 bg-gradient-to-t ${event.gradient} transition-opacity duration-700 group-hover:opacity-90`}></div>

            {/* Nội dung bên trong */}
            <div className="absolute inset-0 p-10 flex flex-col z-10">
              <div className="flex justify-between items-start">
                <div className="bg-white/10 backdrop-blur-xl px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-white border border-white/10 shadow-lg">
                  {event.tag}
                </div>
                <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                  {event.icon}
                </div>
              </div>
              
              <div className="mt-auto space-y-4">
                <h3 className="text-3xl font-[1000] italic text-white tracking-tighter uppercase leading-none group-hover:text-red-500 transition-colors duration-500">
                  {event.title}
                </h3>
                
                <p className="text-zinc-300 text-xs font-bold leading-relaxed tracking-wide opacity-80 group-hover:opacity-100 transition-opacity uppercase italic">
                  {event.desc}
                </p>
                
                {/* Cửa sổ chi tiết (Hòa hợp với tone cũ) */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-10 px-5 bg-white text-black rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500 hover:bg-red-600 hover:text-white">
                    Khám phá ngay
                  </div>
                </div>

                {/* Thanh trang trí chuyển động */}
                <div className="relative h-1 w-12 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="absolute inset-0 bg-red-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                </div>
              </div>
            </div>

            {/* Decor chìm số thứ tự hoặc chữ EVENT */}
            <div className="absolute -top-4 -right-4 text-white/[0.03] font-[1000] text-9xl italic pointer-events-none select-none group-hover:text-white/[0.07] transition-colors">
              0{EVENTS.indexOf(event) + 1}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}