"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, Film, Users, MapPin, 
  Settings, ShieldCheck, LogOut, Bell, 
  Search, Menu, X, ChevronRight, Zap
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const MENU_ITEMS = [
    { group: "Hệ thống", items: [
      { icon: <LayoutDashboard size={20} />, label: "Tổng quan", href: "/super-admin" },
      { icon: <Zap size={20} />, label: "Hiệu suất", href: "/super-admin/performance" },
    ]},
    { group: "Nội dung", items: [
      { icon: <Film size={20} />, label: "Phim & Suất chiếu", href: "/super-admin/showtimes" },
      { icon: <MapPin size={20} />, label: "Hệ thống rạp", href: "/super-admin/cinemas" },
    ]},
    { group: "Nhân sự", items: [
      { icon: <Users size={20} />, label: "Quản lý User", href: "/super-admin/users" },
      { icon: <ShieldCheck size={20} />, label: "Phân quyền", href: "/super-admin/roles" },
    ]},
    { group: "Cấu hình", items: [
      { icon: <Settings size={20} />, label: "Cài đặt chung", href: "/super-admin/settings" },
    ]}
  ];

  if (pathname === '/super-admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
      
      {/* --- SIDEBAR SIÊU BO TRÒN --- */}
      <aside className={`fixed lg:relative z-50 h-screen transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-0 -ml-20 lg:ml-0 lg:w-24'} p-6`}>
        <div className="h-full bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] flex flex-col overflow-hidden">
          
          {/* Logo */}
          <div className="p-10 mb-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] shrink-0">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
            {isSidebarOpen && (
              <h2 className="text-xl font-[1000] italic tracking-tighter uppercase leading-none">
                A&K <br/><span className="text-red-600">Super</span>
              </h2>
            )}
          </div>

          {/* Menu */}
          <nav className="flex-1 px-6 space-y-8 overflow-y-auto no-scrollbar">
            {MENU_ITEMS.map((group, idx) => (
              <div key={idx} className="space-y-3">
                {isSidebarOpen && (
                  <p className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">{group.group}</p>
                )}
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`w-full flex items-center gap-4 p-4 rounded-[1.8rem] transition-all duration-300 group
                        ${active ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'hover:bg-white/5 text-zinc-500 hover:text-zinc-200'}
                      `}
                    >
                      <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{item.icon}</span>
                      {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-6 border-t border-white/5">
            <button className="w-full flex items-center gap-4 p-4 rounded-[1.8rem] text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all">
              <LogOut size={20} />
              {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">Đăng xuất</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Ambient Glow Background */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />

        {/* Top Navbar */}
        <header className="h-28 px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-3 bg-zinc-900/50 border border-white/5 px-6 py-3 rounded-full w-80">
              <Search size={16} className="text-zinc-600" />
              <input type="text" placeholder="Tìm kiếm dữ liệu..." className="bg-transparent text-xs font-bold outline-none w-full placeholder:text-zinc-700" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
              <Bell size={20} />
              <div className="absolute top-3 right-3 w-2 h-2 bg-red-600 rounded-full border-2 border-[#050505]" />
            </button>
            
            <div className="flex items-center gap-4 pl-4 border-l border-white/5">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase text-white leading-none">Admin A&K</p>
                <p className="text-[8px] font-bold uppercase text-red-600 tracking-tighter mt-1">Super Root</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10" />
            </div>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-10 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}