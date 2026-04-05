"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Film, Users, MapPin, 
  Settings, ShieldCheck, LogOut, Bell, 
  Search, Menu, X, Zap, Calendar, BarChart3, Fingerprint, MessageSquare,Clock, Tag, Ticket
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [adminInfo, setAdminInfo] = useState<any>(null); 
  const [cinemaStats, setCinemaStats] = useState<any[]>([]); 
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const adminRes = await fetch('http://localhost:8080/api/v1/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (adminRes.ok) {
          const data = await adminRes.json();
          setAdminInfo(data.data);
        }

        const statsRes = await fetch('http://localhost:8080/api/v1/cinemas/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setCinemaStats(statsData.data); 
        }
      } catch (error) {
        console.error("Lỗi fetch dữ liệu hệ thống:", error);
      }
    };

    fetchData();
  }, [router]);

const handleLogout = () => {
  localStorage.clear(); 
  Cookies.remove('token'); 
  Cookies.remove('role');
  router.push('/login');
};

  const MENU_ITEMS = [
    { label: "Tổng quan", icon: <LayoutDashboard size={20} />, href: "/super-admin" },
    { label: "Phim ảnh", icon: <Film size={20} />, href: "/super-admin/movie" },
    { label: "Hệ thống rạp", icon: <MapPin size={20} />, href: "/super-admin/cinema" },
    { label: "Lịch chiếu", icon: <Calendar size={20} />, href: "/super-admin/showtime" },
    { label: "Quản lý đơn hàng", icon: <MessageSquare size={20} />, href: "/super-admin/order" },
    { label: "Người dùng", icon: <Users size={20} />, href: "/super-admin/user" },
    { label: "Giá vé & Ghế", icon: <Ticket size={20} />, href: "/super-admin/ticket" },
    { label: "Thống kê", icon: <BarChart3 size={20} />, href: "/super-admin/analytic" },
];

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-400 flex font-sans">
      
      <aside className={`h-screen sticky top-0 transition-all duration-500 flex flex-col items-center py-8 border-r border-white/5 bg-black/20 backdrop-blur-xl ${isSidebarOpen ? 'w-64' : 'w-24'}`}>
        <div className="mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-rose-400 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Fingerprint size={22} />
          </div>
          {isSidebarOpen && <span className="text-white font-bold tracking-tighter text-xl">A&K CORE</span>}
        </div>

        <nav className="flex-1 w-full px-4 space-y-2">
          {MENU_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all group relative ${active ? 'bg-white/5 text-white' : 'hover:bg-white/[0.02] hover:text-zinc-200'}`}
              >
                {active && <div className="absolute left-0 w-1 h-5 bg-red-600 rounded-full" />}
                <span className={`${active ? 'text-red-500' : 'group-hover:text-red-400'}`}>{item.icon}</span>
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="w-full px-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-xl text-zinc-600 hover:bg-red-500/5 hover:text-red-500 transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-bold">Thoát</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-black/10 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg">
              <Menu size={20} />
            </button>
            <div className="relative max-w-md w-full ml-4 group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500" />
              <input type="text" placeholder="Tìm kiếm nhanh..." className="w-full bg-white/[0.03] border border-white/5 py-2 pl-10 pr-4 rounded-full text-xs outline-none focus:border-red-500/50" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-white leading-none">
                    {adminInfo ? `${adminInfo.firstName} ${adminInfo.lastName}` : "Đang tải..."}
                </p>
                <p className="text-[10px] text-red-500 mt-1 uppercase font-black tracking-widest">
                    {adminInfo?.roles || "Admin"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden shadow-inner">
                {adminInfo?.avatarUrl && <img src={adminInfo.avatarUrl} alt="avatar" className="w-full h-full object-cover" />}
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 overflow-y-auto relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>

      <aside className="hidden xl:flex w-80 h-screen border-l border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 p-8 flex-col gap-8">
        <div>
          <h3 className="text-white font-bold text-sm mb-6 flex items-center justify-between">
            Trạng thái rạp
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full animate-pulse">Live</span>
          </h3>
          <div className="space-y-6">
            {cinemaStats.length > 0 ? cinemaStats.map((r, i) => (
              <div key={i} className="space-y-2 group cursor-help">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-zinc-300 group-hover:text-white transition-colors">{r.cinemaName}</span>
                  <span className="text-zinc-500">{r.occupancyRate}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                        r.occupancyRate > 80 ? 'bg-red-500' : r.occupancyRate > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${r.occupancyRate}%` }} 
                  />
                </div>
              </div>
            )) : (
                <p className="text-[10px] text-zinc-600 italic">Đang cập nhật dữ liệu rạp...</p>
            )}
          </div>
        </div>

        <div className="mt-auto p-5 bg-zinc-900/50 border border-white/5 rounded-2xl relative overflow-hidden group">
          <div className="absolute -bottom-2 -right-2 text-white/5 group-hover:text-red-600/10 transition-colors">
            <Zap size={60} />
          </div>
          <p className="text-white text-xs font-bold mb-1 italic">Hệ thống Core v2.4</p>
          <p className="text-[10px] text-zinc-500 mb-4 leading-relaxed">Kết nối ổn định với 12 cụm rạp trên toàn quốc.</p>
          <button className="w-full py-2.5 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded-lg border border-white/5 hover:bg-white hover:text-black transition-all">
            KIỂM TRA LOGS
          </button>
        </div>
      </aside>

    </div>
  );
}