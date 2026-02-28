"use client";
import React from "react";
import { ArrowRight, Flame, Crown, Ticket } from "lucide-react";

const EVENTS = [
  {
    title: "Thứ 4 Vui Vẻ",
    desc: "Giá vé đồng giá chỉ từ 50.000đ cho mọi suất chiếu.",
    tag: "Ưu Đãi Hot",
    color: "from-red-600/80 to-black/90",
    icon: <Flame size={32} className="text-orange-500" />,
    img: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500",
  },
  {
    title: "Thành Viên VIP",
    desc: "Giảm ngay 10% và tích điểm đổi bắp nước miễn phí.",
    tag: "Đặc Quyền",
    color: "from-amber-600/80 to-black/90",
    icon: <Crown size={32} className="text-yellow-400" />,
    img: "https://images.unsplash.com/photo-1517604401157-538a9663ecb4?q=80&w=500",
  },
  {
    title: "Combo Cặp Đôi",
    desc: "Bắp lớn + 2 Nước ngọt chỉ 89k khi mua kèm vé.",
    tag: "Bán Chạy",
    color: "from-blue-600/80 to-black/90",
    icon: <Ticket size={32} className="text-cyan-400" />,
    img: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=500",
  },
];

export default function EventSection() {
  return (
    <section className="px-6 md:px-12 py-24 bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex justify-between items-end mb-16">
        <div className="flex items-center gap-5">
          <div className="w-1.5 h-12 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
          <div className="flex flex-col">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
              Sự Kiện & <span className="text-red-600">Ưu Đãi</span>
            </h2>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mt-2 ml-1">
              Đừng bỏ lỡ những deal hời nhất
            </span>
          </div>
        </div>
        
        <button className="hidden md:flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-white transition-all group">
          Xem tất cả <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid Events */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {EVENTS.map((event, index) => (
          <div
            key={index}
            className="group relative h-[380px] rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 hover:border-white/20"
          >
            {/* Ảnh nền */}
            <img 
              src={event.img} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 blur-[1px] group-hover:blur-0" 
              alt={event.title}
            />
            
            {/* Lớp phủ Gradient (Tối hơn để text nổi bật) */}
            <div className={`absolute inset-0 bg-gradient-to-t ${event.color} via-black/40 to-transparent transition-opacity duration-500`}></div>

            {/* Nội dung */}
            <div className="absolute inset-0 p-8 flex flex-col z-10">
              {/* Tag ở góc */}
              <div className="flex justify-between items-start">
                <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                  {event.tag}
                </div>
                <div className="p-2 bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {event.icon}
                </div>
              </div>
              
              <div className="mt-auto">
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-red-500 transition-colors">
                  {event.title}
                </h3>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                  {event.desc}
                </p>
                
                {/* Nút giả lập hoặc Line trang trí */}
                <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Chi tiết ngay <ArrowRight size={14} />
                </div>
                
                <div className="mt-4 h-[2px] w-8 bg-red-600 transition-all duration-500 group-hover:w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}