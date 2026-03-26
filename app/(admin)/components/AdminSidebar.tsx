"use client";
import React from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Monitor, 
  Calendar, 
  Users, 
  Box, 
  Ticket, 
  MessageSquare, 
  History, 
  LogOut, 
  Warehouse
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Tổng quan', icon: LayoutDashboard, href: '/admin' },
    { name: 'Quản lý Vé', icon: Ticket, href: '/admin/tickets' }, 
    { name: 'Lịch chiếu', icon: Calendar, href: '/admin/showtimes' }, 
    { name: 'Phòng chiếu', icon: Monitor, href: '/admin/rooms' }, 
    { name: 'Bắp nước & Combo', icon: Box, href: '/admin/food-combos' },
    { name: 'Quản lý Kho', icon: Warehouse, href: '/admin/inventory' },
    { name: 'Khách hàng', icon: Users, href: '/admin/users' },
  ];

  return (
    <aside className="w-64 h-screen bg-[#080808] border-r border-white/5 flex flex-col sticky top-0 overflow-hidden">
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg shadow-lg shadow-red-600/20 flex items-center justify-center font-black text-white italic">
          A
        </div>
        <div>
          <span className="text-white font-black uppercase italic tracking-tighter text-base block leading-none">A&K Panel</span>
          <span className="text-[8px] text-red-500 font-bold uppercase tracking-[0.2em] mt-1 block">Cinema Manager</span>
        </div>
      </div>

      {/* Navigation - Ẩn thanh cuộn */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group ${
                isActive 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                : 'text-zinc-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <link.icon size={16} className={`${isActive ? 'text-white' : 'group-hover:text-red-500 transition-colors'}`} />
              <span className="truncate">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 mt-auto border-t border-white/5 shrink-0 bg-black/50">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-red-500/5 rounded-xl">
          <LogOut size={16} /> 
          <span>Đăng xuất hệ thống</span>
        </button>
      </div>
    </aside>
  );
}