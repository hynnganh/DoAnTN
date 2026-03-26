"use client";
import React, { useState, useEffect } from 'react';
import { Bell, Search, User, ChevronDown, ShieldCheck, LogOut } from 'lucide-react';
import Cookies from 'js-cookie';

export default function AdminHeader() {
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Lấy dữ liệu người dùng thực tế
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:8080/api/v1/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          setAdminInfo(result.data?.user || result.data);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin Header:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove('token');
    window.location.href = '/login';
  };

  return (
    <header className="h-20 border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl px-6 md:px-10 flex items-center justify-between sticky top-0 z-50 shrink-0">
      
      {/* Search Bar - Tối ưu focus và placeholder */}
      <div className="relative w-64 md:w-96 group">
        <Search 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors" 
          size={16} 
        />
        <input 
          type="text"
          placeholder="Tìm phim, mã vé hoặc rạp..." 
          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-[11px] font-bold outline-none focus:border-red-600/30 transition-all text-white placeholder:text-zinc-600"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Notifications */}
        <button className="relative p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-600 rounded-full border-2 border-[#050505] animate-pulse"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-white/5 hidden sm:block"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-2 group transition-all"
          >
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-white uppercase italic tracking-tighter leading-none">
                {adminInfo ? `${adminInfo.firstName} ${adminInfo.lastName}` : "Cảnh báo: Khách"}
              </p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <ShieldCheck size={10} className="text-red-500" />
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                  {adminInfo?.roles || "ADMIN PANEL"}
                </p>
              </div>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-red-600/50 transition-all">
              {adminInfo?.avatar ? (
                <img src={adminInfo.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-zinc-600 group-hover:text-red-500 transition-colors" />
              )}
            </div>
            
            <ChevronDown size={14} className={`text-zinc-600 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setShowProfileMenu(false)} 
              />
              <div className="absolute right-0 mt-4 w-56 bg-zinc-950 border border-white/5 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
                <div className="p-3 border-b border-white/5 mb-1">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Email hệ thống</p>
                  <p className="text-xs text-zinc-300 truncate font-medium">{adminInfo?.email || 'admin@akcinema.vn'}</p>
                </div>
                
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
                  <User size={14} /> Hồ sơ cá nhân
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all mt-1"
                >
                  <LogOut size={14} /> Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}