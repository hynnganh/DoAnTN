"use client";
import React from 'react';
import { Smartphone, Monitor, Speaker, Zap, ArrowRight, Star, Download } from 'lucide-react';

const FEATURES = [
  {
    icon: <Monitor size={24} />,
    title: "Công Nghệ IMAX",
    desc: "Màn hình khổng lồ, độ phân giải cực đại cho trải nghiệm thị giác vô tận.",
    color: "text-blue-400",
    glow: "group-hover:shadow-blue-500/20"
  },
  {
    icon: <Speaker size={24} />,
    title: "Dolby Atmos",
    desc: "Hệ thống âm thanh vòm 360 độ, chân thực đến từng nhịp thở.",
    color: "text-purple-400",
    glow: "group-hover:shadow-purple-500/20"
  },
  {
    icon: <Zap size={24} />,
    title: "Trải Nghiệm 4DX",
    desc: "Ghế chuyển động, gió, nước và mùi hương hòa quyện vào bộ phim.",
    color: "text-red-500",
    glow: "group-hover:shadow-red-500/20"
  }
];

export default function CinematicUniverse() {
  return (
    <section className="bg-[#0a0a0c] py-32 px-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* --- LEFT: TRẢI NGHIỆM CÔNG NGHỆ --- */}
          <div className="space-y-12 order-2 lg:order-1">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-red-600" />
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.5em]">The Standard</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-[1000] italic text-white uppercase tracking-tighter leading-[0.9]">
                Chuẩn Mực <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500 underline decoration-red-600 decoration-8 underline-offset-[12px]">Điện Ảnh</span>
              </h2>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest max-w-md leading-relaxed">
                Chúng tôi không chỉ chiếu phim, chúng tôi tạo ra những vũ trụ sống động ngay trước mắt bạn.
              </p>
            </div>

            <div className="space-y-6">
              {FEATURES.map((f, i) => (
                <div key={i} className="group flex gap-6 p-6 rounded-[2rem] border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all duration-500">
                  <div className={`w-14 h-14 shrink-0 rounded-2xl bg-black border border-white/10 flex items-center justify-center ${f.color} shadow-inner group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-white uppercase italic">{f.title}</h4>
                    <p className="text-zinc-500 text-xs font-medium leading-relaxed uppercase tracking-tight">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: APP DOWNLOAD (BO TRÒN SÂU) --- */}
          <div className="relative order-1 lg:order-2">
            <div className="relative z-10 p-12 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[4rem] shadow-2xl overflow-hidden group">
              {/* Overlay Decor */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-600/10 blur-[80px] rounded-full group-hover:bg-red-600/20 transition-all duration-1000" />
              
              <div className="space-y-10 relative z-20">
                <div className="inline-flex p-4 bg-red-600 text-white rounded-3xl shadow-[0_10px_30px_rgba(220,38,38,0.4)]">
                  <Smartphone size={40} strokeWidth={1.5} />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-4xl font-[1000] italic text-white uppercase tracking-tighter leading-tight">
                    Mang cả rạp phim <br />vào túi của bạn
                  </h3>
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em]">
                    Đặt vé nhanh hơn, tích điểm nhiều hơn với ứng dụng mobile.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="flex-1 h-16 bg-white text-black rounded-2xl flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all shadow-xl">
                    <Download size={20} />
                    <div className="text-left">
                      <p className="text-[8px] font-black uppercase leading-none">Download on</p>
                      <p className="text-sm font-black uppercase leading-none mt-1 italic">App Store</p>
                    </div>
                  </button>
                  <button className="flex-1 h-16 bg-zinc-800 text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-700 transition-all border border-white/5 shadow-xl">
                    <div className="text-left flex items-center gap-3">
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-xs font-black uppercase tracking-widest">Google Play</span>
                    </div>
                  </button>
                </div>

                {/* Stat Chìm */}
                <div className="pt-8 flex items-center gap-10 border-t border-white/5">
                   <div>
                     <p className="text-2xl font-black text-white italic">5M+</p>
                     <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Lượt tải</p>
                   </div>
                   <div>
                     <p className="text-2xl font-black text-white italic">4.9/5</p>
                     <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Đánh giá</p>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Chữ Trang Trí Khổng Lồ */}
            <div className="absolute -bottom-10 -left-10 text-white/[0.02] font-[1000] text-[12rem] italic pointer-events-none select-none uppercase">
              App
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}