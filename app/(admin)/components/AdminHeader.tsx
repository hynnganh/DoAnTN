"use client";
import { Bell, Search, User } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="h-20 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md px-10 flex items-center justify-between sticky top-0 z-50">
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={16} />
        <input 
          placeholder="Tìm kiếm phim, rạp hoặc mã đơn hàng..." 
          className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-[11px] font-medium outline-none focus:border-red-600/50 transition-all text-white"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer text-zinc-500 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full border border-[#050505]"></span>
        </div>
        
        <div className="h-8 w-[1px] bg-white/5"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-[10px] font-black text-white uppercase italic tracking-widest">Master Admin</p>
            <p className="text-[9px] font-bold text-zinc-600 uppercase">Hệ thống tổng</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}