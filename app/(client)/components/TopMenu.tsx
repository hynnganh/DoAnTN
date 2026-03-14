"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Ticket, Bell, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";

export default function TopMenu() {
  // Thêm avatar vào interface để tránh lỗi logic
  const [user, setUser] = useState<{ firstName: string; lastName: string; avatar?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_info");
    const token = localStorage.getItem("token");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    window.location.href = "/";
  };

  return (
    <div className="bg-black border-b border-white/10 relative z-[999]">
      <div className="max-w-[1440px] mx-auto flex justify-end items-center gap-8 px-6 md:px-12 py-2.5">
        
        {/* Link tiện ích */}
        <div className="flex items-center gap-6">
          <Link href="/news" className="flex items-center gap-2 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-widest group">
            <Bell size={14} className="text-red-600 group-hover:animate-bounce" />
            <span>Tin mới</span>
          </Link>

          <Link href="/my-tickets" className="flex items-center gap-2 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-widest">
            <Ticket size={14} className="text-red-600" />
            <span>Vé của tôi</span>
          </Link>
        </div>

        <div className="h-3 w-[1px] bg-white/20"></div>

        {/* KHU VỰC USER VỚI DROPDOWN */}
        {user ? (
          <div className="relative group py-1">
            {/* Phần hiển thị chính */}
            <div className="flex items-center gap-3 cursor-pointer select-none">
              <span className="text-[11px] font-black text-zinc-100 group-hover:text-red-500 transition-all uppercase tracking-widest italic border-b border-red-600/30">
                {user.lastName} {user.firstName}
              </span>
              
              <div className="relative w-8 h-8 bg-zinc-900 border border-white/10 rounded-lg overflow-hidden group-hover:border-red-600 transition-all shadow-md">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src = `https://ui-avatars.com/api/?name=${user.firstName}&background=random`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white group-hover:bg-red-600 transition-all">
                    <User size={14} />
                  </div>
                )}
              </div>
              <ChevronDown size={12} className="text-zinc-500 group-hover:rotate-180 transition-transform duration-300" />
            </div>

            {/* MENU THẢ XUỐNG (Dropdown) */}
            <div className="absolute right-0 mt-2 w-48 bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 transition-all duration-300 z-[110]">
              <div className="p-2 border-b border-white/5 bg-white/[0.02]">
                <p className="px-3 py-1 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Tài khoản hội viên</p>
              </div>
              
              <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wider">
                <Settings size={14} className="text-red-600" />
                Thông tin cá nhân
              </Link>
              
              <Link href="/my-tickets" className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wider">
                <CreditCard size={14} className="text-red-600" />
                Lịch sử giao dịch
              </Link>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-red-500 hover:bg-red-600 hover:text-white transition-all uppercase tracking-[0.2em] border-t border-white/5"
              >
                <LogOut size={14} />
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <Link href="/auth" className="flex items-center gap-2 text-zinc-300 hover:text-red-500 transition-all text-[11px] font-black uppercase tracking-widest">
            <div className="p-1 bg-white/5 rounded-full border border-white/10">
              <User size={14} />
            </div>
            <span>Đăng nhập / Đăng ký</span>
          </Link>
        )}
      </div>
    </div>
  );
}