"use client";
import React from 'react';
import { TrendingUp, Activity, DollarSign, Globe, ArrowUpRight } from 'lucide-react';

export default function SuperDashboard() {
  return (
    <div className="space-y-10 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-12 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[4rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe size={200} strokeWidth={1} />
          </div>
          <div className="relative z-10 space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.5em] text-red-600">Hệ thống toàn quốc</h3>
            <h2 className="text-6xl font-[1000] italic tracking-tighter uppercase leading-[0.9]">
              Doanh thu <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">24.8 Tỷ VNĐ</span>
            </h2>
            <div className="flex gap-10 pt-4">
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Tăng trưởng</p>
                <p className="text-2xl font-black italic text-emerald-400">+18.5%</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Suất chiếu</p>
                <p className="text-2xl font-black italic text-white">1,402</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-600 p-10 rounded-[4rem] flex flex-col justify-between shadow-[0_30px_60px_-15px_rgba(220,38,38,0.3)]">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
            <Activity size={28} />
          </div>
          <div className="space-y-2 text-white">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Trạng thái hệ thống</p>
            <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter">99.9% Online</h3>
            <p className="text-[10px] font-bold">Tất cả 12 rạp đang hoạt động ổn định</p>
          </div>
        </div>
      </div>

      {/* Grid chi tiết bên dưới (Ví dụ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 bg-zinc-900/20 border border-white/5 rounded-[3.5rem]">
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-sm font-black uppercase tracking-widest italic">Cụm rạp tiêu biểu</h4>
            <ArrowUpRight size={20} className="text-zinc-600" />
          </div>
          <div className="space-y-6">
            {[
              { name: "A&K Thủ Đức", rev: "4.2B", status: "Hot" },
              { name: "A&K Quận 1", rev: "3.8B", status: "Stable" },
              { name: "A&K Landmark", rev: "5.1B", status: "Top" }
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-xs font-black uppercase italic">{r.name}</span>
                <span className="text-xs font-black text-red-600">{r.rev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}