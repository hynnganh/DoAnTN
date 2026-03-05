"use client";
import React, { useState } from 'react';
import { 
  Plus, Calendar as CalendarIcon, Clock, 
  ChevronLeft, ChevronRight, Filter, Search,
  Film, Monitor
} from 'lucide-react';

const ROOMS = ["Phòng 01 (IMAX)", "Phòng 02 (4DX)", "Phòng 03 (Standard)", "Phòng 04 (Standard)"];

const SHOWTIMES = [
  { id: 1, movie: "Dune: Part Two", room: "Phòng 01 (IMAX)", start: "09:00", end: "11:45", color: "bg-red-600/20 border-red-600/50" },
  { id: 2, movie: "Kung Fu Panda 4", room: "Phòng 02 (4DX)", start: "10:15", end: "12:00", color: "bg-amber-600/20 border-amber-600/50" },
  { id: 3, movie: "Exhuma: Quật Mộ Trùng Tang", room: "Phòng 03 (Standard)", start: "08:30", end: "10:45", color: "bg-purple-600/20 border-purple-600/50" },
  { id: 4, movie: "Dune: Part Two", room: "Phòng 01 (IMAX)", start: "13:00", end: "15:45", color: "bg-red-600/20 border-red-600/50" },
];

export default function ShowtimePage() {
  const [selectedDate, setSelectedDate] = useState("2024-03-20");

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER QUẢN LÝ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-500 mb-1">
            <Clock size={16} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Lịch trình hệ thống</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-[1000] italic uppercase tracking-tighter text-white">
            Quản lý <span className="text-red-600">Suất Chiếu</span>
          </h2>
        </div>

        <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl group">
          <Plus size={18} strokeWidth={3} />
          Thêm suất chiếu mới
        </button>
      </div>

      {/* THANH ĐIỀU KHIỂN & LỊCH */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex items-center gap-4 bg-zinc-900/40 p-4 rounded-[2rem] border border-white/5 backdrop-blur-md">
          <button className="p-3 hover:bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all">
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex-1 flex justify-around overflow-x-auto gap-4 no-scrollbar">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, i) => (
              <button key={i} className={`flex flex-col items-center min-w-[60px] py-3 rounded-2xl transition-all ${i === 2 ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:bg-white/5'}`}>
                <span className="text-[9px] font-black uppercase mb-1">{day}</span>
                <span className="text-lg font-black tracking-tighter">{20 + i}</span>
              </button>
            ))}
          </div>

          <button className="p-3 hover:bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 bg-zinc-900/40 p-4 rounded-[2rem] border border-white/5">
          <Filter size={18} className="text-zinc-600 ml-2" />
          <select className="bg-transparent text-xs font-black uppercase tracking-widest text-zinc-400 outline-none w-full cursor-pointer">
            <option>Tất cả cụm rạp</option>
            <option>A&K Cinema Thủ Đức</option>
            <option>A&K Cinema Quận 1</option>
          </select>
        </div>
      </div>

      {/* BẢNG TIMELINE SUẤT CHIẾU */}
      <div className="bg-[#0c0c0e] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 w-64 bg-zinc-900/20">Phòng chiếu</th>
                <th className="p-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Lịch trình chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {ROOMS.map((room, index) => (
                <tr key={index} className="border-b border-white/[0.02] group hover:bg-white/[0.01] transition-colors">
                  <td className="p-8 bg-zinc-900/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-red-500 transition-colors">
                        <Monitor size={18} />
                      </div>
                      <span className="text-sm font-black text-white italic tracking-tight">{room}</span>
                    </div>
                  </td>
                  <td className="p-8 relative h-32">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                      {SHOWTIMES.filter(s => s.room === room).map((show) => (
                        <div 
                          key={show.id}
                          className={`shrink-0 min-w-[200px] p-4 rounded-[1.5rem] border ${show.color} backdrop-blur-sm cursor-pointer hover:scale-105 transition-all group/card relative`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-black text-white/50 uppercase tracking-tighter">
                              {show.start} — {show.end}
                            </span>
                            <Film size={12} className="text-white/20" />
                          </div>
                          <h5 className="text-[11px] font-black text-white uppercase truncate">{show.movie}</h5>
                          
                          {/* Hover Action */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity rounded-[1.5rem] flex items-center justify-center gap-3">
                             <button className="text-[8px] font-bold uppercase tracking-widest text-white hover:text-red-500">Sửa</button>
                             <div className="w-px h-3 bg-white/20" />
                             <button className="text-[8px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400">Xóa</button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Nút thêm nhanh */}
                      <button className="shrink-0 w-12 h-20 rounded-[1.5rem] border border-dashed border-white/10 flex items-center justify-center text-zinc-700 hover:text-white hover:border-white/30 transition-all hover:bg-white/5">
                        <Plus size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER STATS */}
      <div className="flex items-center gap-10 text-zinc-600 text-[9px] font-bold uppercase tracking-widest px-8">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
            <span>24 Suất chiếu hôm nay</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-800" />
            <span>4 Phòng đang hoạt động</span>
         </div>
      </div>
    </div>
  );
}