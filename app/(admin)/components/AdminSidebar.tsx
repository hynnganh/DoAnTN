"use client";
import React from 'react';
import { LayoutDashboard, Film, Monitor, Calendar, Users, Box, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Tổng quan', icon: LayoutDashboard, href: '/admin' },
    { name: 'Quản lý Phim', icon: Film, href: '/admin/movies' },
    { name: 'Hệ thống Rạp', icon: Monitor, href: '/admin/cinemas' },
    { name: 'Lịch chiếu', icon: Calendar, href: '/admin/showtimes' },
    { name: 'Khách hàng', icon: Users, href: '/admin/users' },
    { name: 'Bắp nước & Combo', icon: Box, href: '/admin/combos' },
    { name: 'Phân quyền', icon: Shield, href: '/admin/system', isBigAdmin: true },
  ];

  return (
    <aside className="w-64 h-screen bg-[#080808] border-r border-white/5 flex flex-col sticky top-0">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-red-600 rounded-lg shadow-lg shadow-red-600/30 flex items-center justify-center font-black text-white italic">A</div>
        <span className="text-white font-black uppercase italic tracking-tighter text-lg">A&K Panel</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive 
                ? 'bg-red-600 text-white' 
                : link.isBigAdmin ? 'text-yellow-500 hover:bg-yellow-500/5' : 'text-zinc-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors">
          <LogOut size={18} /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}