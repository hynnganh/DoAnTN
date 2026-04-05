"use client";

import React, { useState } from 'react';
import { 
  ShieldCheck, MapPin, Search, Filter, 
  BarChart3, Landmark, LayoutGrid, 
  ChevronRight, Calendar, Hash, Building2
} from 'lucide-react';

// 1. MOCK DATA PHÂN CẤP: TP.HCM -> QUẬN -> RẠP
const MOCK_HCM_ORDERS = [
  { id: "GS-Q1-001", movie: "Kung Fu Panda 4", district: "Quận 1", cinema: "Golden Star - Bitexco", amount: 120000, time: "14:30", date: "05/04", status: "SUCCESS" },
  { id: "GS-Q7-002", movie: "Dune: Part Two", district: "Quận 7", cinema: "Golden Star - Crescent Mall", amount: 250000, time: "19:00", date: "05/04", status: "SUCCESS" },
  { id: "GS-BT-003", movie: "Exhuma", district: "Bình Thạnh", cinema: "Golden Star - Landmark 81", amount: 95000, time: "21:15", date: "04/04", status: "CANCELLED" },
  { id: "GS-Q1-004", movie: "Mai", district: "Quận 1", cinema: "Golden Star - Hai Bà Trưng", amount: 180000, time: "10:00", date: "04/04", status: "SUCCESS" },
  { id: "GS-GV-005", movie: "Quỷ Cẩu", district: "Gò Vấp", cinema: "Golden Star - Quang Trung", amount: 85000, time: "15:45", date: "05/04", status: "SUCCESS" },
];

export default function SuperAdminHCMPage() {
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách các Quận duy nhất để làm filter
  const districts = ["ALL", ...Array.from(new Set(MOCK_HCM_ORDERS.map(o => o.district)))];

  const filteredOrders = MOCK_HCM_ORDERS.filter(order => {
    const matchDistrict = selectedDistrict === "ALL" || order.district === selectedDistrict;
    const matchSearch = order.movie.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        order.cinema.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.id.includes(searchTerm);
    return matchDistrict && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans tracking-tight">
      
      {/* HEADER: PHẠM VI TP.HCM */}
      <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.1)]">
            <MapPin className="text-red-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter">
              Khu vực <span className="text-red-600">TP. Hồ Chí Minh</span>
            </h1>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-1 italic">
              Quản lý mạng lưới rạp theo Quận/Huyện
            </p>
          </div>
        </div>

        <div className="hidden lg:flex gap-10">
            <div className="text-right border-r border-white/5 pr-8">
                <p className="text-[8px] font-black text-zinc-700 uppercase italic mb-1 text-nowrap">Tổng đơn hôm nay</p>
                <p className="text-2xl font-[1000] italic text-white leading-none">1,284</p>
            </div>
            <div className="text-right">
                <p className="text-[8px] font-black text-zinc-700 uppercase italic mb-1 text-nowrap">Doanh thu HCM</p>
                <p className="text-2xl font-[1000] italic text-emerald-500 leading-none">542.000.000đ</p>
            </div>
        </div>
      </div>

      {/* TOOLBAR: LỌC THEO QUẬN & TÌM KIẾM */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-red-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Tìm mã vé, tên phim hoặc tên rạp..."
            className="w-full bg-zinc-900/30 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-[11px] font-bold outline-none focus:border-red-600/50 focus:bg-zinc-900/50 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex bg-zinc-900/30 border border-white/5 rounded-2xl p-1 gap-1">
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                selectedDistrict === d ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              {d === "ALL" ? "Tất cả Quận" : d}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH ĐƠN HÀNG DẠNG BẢNG HIỆN ĐẠI */}
      <div className="bg-zinc-950/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-6 text-[9px] font-black uppercase text-zinc-700 tracking-widest italic">Mã Đơn</th>
                <th className="p-6 text-[9px] font-black uppercase text-zinc-700 tracking-widest italic">Phim & Thời gian</th>
                <th className="p-6 text-[9px] font-black uppercase text-zinc-700 tracking-widest italic">Địa điểm</th>
                <th className="p-6 text-[9px] font-black uppercase text-zinc-700 tracking-widest italic text-right">Tổng thanh toán</th>
                <th className="p-6 text-[9px] font-black uppercase text-zinc-700 tracking-widest italic text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/5 text-zinc-800 group-hover:text-red-600 transition-colors">
                          <Hash size={16} />
                      </div>
                      <span className="text-xs font-black italic tracking-tight">{order.id}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div>
                      <p className="text-sm font-black uppercase italic tracking-tighter group-hover:text-red-500 transition-colors">{order.movie}</p>
                      <div className="flex items-center gap-3 mt-1 text-zinc-600 text-[10px] font-bold uppercase italic">
                          <span className="flex items-center gap-1"><Calendar size={10}/> {order.date}</span>
                          <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                          <span>{order.time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                     <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Building2 size={12} className="text-red-600" />
                            <span className="text-[10px] font-black uppercase text-zinc-300 italic tracking-tight">{order.cinema}</span>
                        </div>
                        <span className="text-[8px] font-black text-zinc-600 uppercase ml-5 tracking-widest">{order.district}</span>
                     </div>
                  </td>
                  <td className="p-6 text-right">
                    <p className="text-base font-[1000] italic text-zinc-200">{order.amount.toLocaleString()}đ</p>
                    <span className={`text-[8px] font-black uppercase tracking-tighter italic ${order.status === 'SUCCESS' ? 'text-emerald-500' : 'text-zinc-700'}`}>
                        {order.status === 'SUCCESS' ? '• Hoàn tất' : '• Đã hủy'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                      {/* Super Admin chỉ Xem (✅) */}
                      <button className="w-10 h-10 inline-flex items-center justify-center bg-zinc-900 hover:bg-white hover:text-black rounded-xl transition-all shadow-xl group-hover:scale-110 active:scale-90">
                          <ChevronRight size={18} />
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER ĐIỀU HƯỚNG */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center px-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[8px] font-black text-zinc-500">{i}</div>)}
            </div>
            <p className="text-[9px] font-black uppercase text-zinc-800 tracking-[0.3em] italic">
              Đang quản lý {filteredOrders.length} điểm rạp khu vực HCM
            </p>
          </div>
          
          <div className="flex gap-4">
              <button className="bg-zinc-900 border border-white/5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all">Trước</button>
              <button className="bg-red-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase text-white hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]">Tiếp theo</button>
          </div>
      </div>
    </div>
  );
}