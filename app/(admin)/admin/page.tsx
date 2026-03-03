"use client";
import React from 'react';
import { 
  TrendingUp, Users, Ticket, DollarSign, 
  ArrowUpRight, Monitor, Star, ShoppingBag,
  Clock, MousePointer2, AlertCircle
} from 'lucide-react';

export default function EnhancedAdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* SECTION 1: TOP STATS - Tổng hợp từ payments, tickets, users [cite: 6, 64, 47] */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Doanh thu vé', value: '820M', icon: Ticket, color: 'text-red-500', trend: '+12%' },
          { label: 'Doanh thu F&B', value: '145M', icon: ShoppingBag, color: 'text-orange-500', trend: '+5%' },
          { label: 'Khách hàng', value: '2,401', icon: Users, color: 'text-blue-500', trend: '+18%' },
          { label: 'Lượt truy cập', value: '12.5k', icon: MousePointer2, color: 'text-purple-500', trend: '+22%' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0c0c0c] border border-white/5 p-6 rounded-[2rem] hover:bg-[#111] transition-all">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-black text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg">
                {stat.trend} <ArrowUpRight size={12} />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-[1000] italic text-white uppercase tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 2: BIỂU ĐỒ DOANH THU & TOP PHIM [cite: 110, 119] */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Tăng trưởng doanh thu 7 ngày qua</h3>
              <select className="bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold px-3 py-1 outline-none text-zinc-400">
                <option>Tất cả rạp</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-3 px-2">
              {[60, 40, 95, 70, 55, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all">
                    {h * 10}tr
                  </div>
                  <div className="w-full bg-white/5 rounded-t-xl group-hover:bg-red-600/50 transition-all duration-500" style={{ height: `${h}%` }}>
                    <div className="w-full bg-red-600 rounded-t-xl transition-all duration-700 opacity-0 group-hover:opacity-100" style={{ height: '20%' }} />
                  </div>
                  <p className="text-[8px] text-zinc-600 font-black mt-4 text-center">T{i+2}</p>
                </div>
              ))}
            </div>
          </div>

          {/* DANH SÁCH SUẤT CHIẾU SẮP DIỄN RA [cite: 119, 92] */}
          <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-white italic mb-6">Suất chiếu sắp tới</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-red-600/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-red-500">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase italic">Dune: Part Two</p>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">Phòng 0{s} • A&K Thủ Đức [cite: 92, 95]</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white italic">19:30</p>
                    <p className="text-[8px] text-green-500 font-bold uppercase">85/120 Ghế [cite: 103]</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: SIDEBAR DASHBOARD - BẮP NƯỚC & HOẠT ĐỘNG [cite: 1, 65] */}
        <div className="space-y-6">
          {/* Top Bắp Nước (Combos)  */}
          <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-white italic mb-6">Top Bắp Nước</h3>
            <div className="space-y-6">
              {[
                { name: 'Combo Solo', sales: 420, price: '85k' },
                { name: 'Family Pack', sales: 215, price: '250k' },
                { name: 'Popcorn Large', sales: 680, price: '60k' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[10px] font-black text-zinc-500">#{i+1}</div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-white uppercase">{item.name}</p>
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-zinc-600 font-bold">{item.sales} đơn</span>
                      <span className="text-[9px] text-red-500 font-black italic">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cảnh báo hệ thống (Dành cho Big Admin) */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 text-amber-500 mb-4">
              <AlertCircle size={20} />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Cảnh báo hệ thống</h3>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic">
                - Có 3 giao dịch thanh toán thất bại cần kiểm tra[cite: 6].
              </p>
              <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic">
                - Phòng chiếu 04 đang bảo trì thiết bị[cite: 92].
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}