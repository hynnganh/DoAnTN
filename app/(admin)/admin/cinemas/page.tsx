"use client";
import React from 'react';
import Link from 'next/link';
import { Monitor, MapPin, Grid, Plus, Users, LayoutDashboard, ChevronRight, Activity, Filter } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function AdminCinemaPage() {
  const cinemaData = {
    name: "A&K Cinema Thủ Đức",
    address: "Số 1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP.HCM",
    totalStaff: 12,
    rooms: [
      { id: "p01", name: "Phòng chiếu 01", seats: 120, type: "2D Standard", status: "Active" },
      { id: "p02", name: "Phòng chiếu 02", seats: 80, type: "3D IMAX", status: "Maintenance" },
      { id: "p03", name: "Phòng chiếu 03", seats: 150, type: "4DX", status: "Active" },
      { id: "p04", name: "Phòng chiếu 04", seats: 120, type: "2D Standard", status: "Active" },
    ]
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 px-4 animate-in fade-in duration-1000">
      <Toaster position="bottom-right" />

      {/* --- HERO SECTION (Header Card) --- */}
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-zinc-900/40 border border-white/5 shadow-2xl">
        {/* Lớp nền hiệu ứng chìm */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-red-600/5 to-transparent skew-x-12 translate-x-20 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full" />
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-zinc-800/50 backdrop-blur-md border border-white/5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                Hệ thống đang vận hành
              </span>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-[1000] tracking-tight text-white leading-tight">
                {cinemaData.name}
              </h1>
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin size={16} className="text-red-500/80" />
                <p className="text-sm font-medium tracking-wide">{cinemaData.address}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="flex gap-4 w-full lg:w-auto">
            {[
              { label: 'Nhân sự', val: cinemaData.totalStaff, icon: <Users size={18}/> },
              { label: 'Phòng máy', val: cinemaData.rooms.length, icon: <Monitor size={18}/> }
            ].map((stat, i) => (
              <div key={i} className="flex-1 lg:flex-none min-w-[140px] p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl hover:bg-white/[0.06] transition-all">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">{stat.label}</p>
                <div className="flex items-center gap-3">
                  <div className="text-red-500/60">{stat.icon}</div>
                  <span className="text-3xl font-black text-white italic">{stat.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- ROOM MANAGEMENT SECTION --- */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Quản lý sơ đồ</h2>
              <p className="text-xs text-zinc-500 font-medium">Cấu hình chỗ ngồi & trạng thái phòng</p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:border-white/10 transition-all">
            <Filter size={14} /> Lọc dữ liệu
          </button>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cinemaData.rooms.map((room) => (
            <Link 
              key={room.id} 
              href={`/admin/cinemas/seats/${room.id}`}
              className="group relative bg-zinc-900/20 border border-white/5 p-7 rounded-[2rem] hover:bg-zinc-800/30 hover:border-red-600/30 transition-all duration-300 overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 bg-white/[0.03] rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-red-500 group-hover:bg-red-500/10 transition-all duration-500">
                    <Grid size={22} />
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${
                    room.status === 'Active' 
                    ? 'bg-green-500/5 border-green-500/20 text-green-500' 
                    : 'bg-amber-500/5 border-amber-500/20 text-amber-500'
                  }`}>
                    {room.status}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-red-500/80 uppercase tracking-[0.2em] italic">{room.type}</span>
                  <h4 className="text-2xl font-black text-zinc-100 leading-tight tracking-tight">
                    {room.name}
                  </h4>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xl font-black text-white italic tracking-tighter">{room.seats}</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">vị trí ngồi</span>
                  </div>
                </div>

                <div className="pt-5 flex items-center justify-between border-t border-white/5 group-hover:border-red-600/10 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-zinc-300 tracking-widest transition-colors">
                    Cấu hình ghế
                  </span>
                  <ChevronRight size={14} className="text-zinc-600 group-hover:translate-x-1 group-hover:text-red-500 transition-all" />
                </div>
              </div>
            </Link>
          ))}

          {/* Add New Room Button */}
          <button className="group relative min-h-[260px] flex flex-col items-center justify-center gap-5 border-2 border-dashed border-white/5 rounded-[2rem] hover:border-red-600/20 hover:bg-red-600/[0.01] transition-all duration-300">
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-zinc-600 group-hover:bg-red-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-xl">
              <Plus size={28} strokeWidth={2.5} />
            </div>
            <div className="text-center space-y-1">
              <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                Thêm phòng
              </span>
              <p className="text-[9px] font-medium text-zinc-600 uppercase">Create New Theater</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}