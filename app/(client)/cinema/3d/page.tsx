"use client";
import React from 'react';
import { Layers, Zap, Eye, Wind, MonitorCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const TECH_FEATURES = [
  {
    icon: <Zap className="text-yellow-400" />,
    title: "Triple Beam Technology",
    desc: "Tăng cường độ sáng gấp đôi so với chuẩn 3D thông thường, loại bỏ hiện tượng mỏi mắt."
  },
  {
    icon: <Layers className="text-blue-400" />,
    title: "HFR (High Frame Rate)",
    desc: "Tốc độ khung hình 48fps giúp các phân cảnh hành động mượt mà, không bị bóng ma."
  },
  {
    icon: <Eye className="text-purple-400" />,
    title: "Circular Polarization",
    desc: "Kính 3D phân cực tròn cho phép bạn nghiêng đầu thoải mái mà không mất hiệu ứng nổi."
  }
];

export default function Cinema3DPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-20 selection:bg-blue-600/30">
      {/* HERO SECTION - Tập trung vào hiệu ứng nổi */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000" 
            className="w-full h-full object-cover opacity-40 scale-110 blur-[2px]" 
            alt="3D Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">New Generation 3D</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-[1000] italic uppercase tracking-tighter leading-[0.8] drop-shadow-2xl">
            BƯỚC RA <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">KHỎI KHUNG HÌNH</span>
          </h1>
          
          <p className="text-zinc-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Trải nghiệm công nghệ RealD 3D thế hệ mới với độ phân giải 4K, mang lại chiều sâu tuyệt đối và màu sắc rực rỡ chưa từng có.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-32">
        
        {/* TECH GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TECH_FEATURES.map((feat, i) => (
            <div key={i} className="p-10 bg-zinc-900/20 border border-white/5 rounded-[3rem] space-y-6 hover:border-blue-500/50 transition-all group">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">{feat.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feat.desc}</p>
            </div>
          ))}
        </section>

        {/* COMPARISON SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-[1000] italic uppercase tracking-tighter leading-tight">
              Định nghĩa lại <br /> <span className="text-blue-500">Độ sáng 3D</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/5">
                <MonitorCheck className="shrink-0 text-blue-500" size={32} />
                <div className="space-y-2">
                  <h4 className="font-bold uppercase italic">Màn hình Bạc (Silver Screen)</h4>
                  <p className="text-zinc-500 text-xs font-medium">Sử dụng màn hình phủ bạc đặc biệt để phản xạ ánh sáng tối đa, giữ cho hình ảnh 3D luôn rực rỡ.</p>
                </div>
              </div>
              <div className="flex gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/5">
                <Wind className="shrink-0 text-blue-500" size={32} />
                <div className="space-y-2">
                  <h4 className="font-bold uppercase italic">Kính 3D siêu nhẹ</h4>
                  <p className="text-zinc-500 text-xs font-medium">Thiết kế công thái học, vừa vặn cả với người đeo kính cận, không gây nặng sống mũi.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full" />
            <img 
              src="https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=1000" 
              className="relative z-10 w-full aspect-[4/3] object-cover rounded-[4rem] border border-white/10 shadow-2xl" 
              alt="3D Experience" 
            />
          </div>
        </section>

        {/* BOTTOM CTA */}
        <div className="relative py-20 rounded-[4rem] overflow-hidden border border-white/5 text-center space-y-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20" />
          <h2 className="relative z-10 text-4xl font-[1000] italic uppercase tracking-tighter">Sẵn sàng cho chuyến phiêu lưu?</h2>
          <Link 
            href="/movies"
            className="relative z-10 inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-[1000] uppercase text-xs tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all group"
          >
            Xem lịch chiếu 3D <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}