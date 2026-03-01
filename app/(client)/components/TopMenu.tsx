"use client";
import Link from "next/link";
import { User, Ticket, Bell } from "lucide-react";

export default function TopMenu() {
  return (
    <div className="bg-[#080808] border-b border-white/5">
      <div className="max-w-[1440px] mx-auto flex justify-end items-center gap-8 px-6 md:px-12 py-2.5">
        
        {/* Tin mới & Ưu đãi */}
        <Link 
          href="/news-offers" 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider group"
        >
          <Bell size={14} className="group-hover:animate-ring text-red-500" />
          <span>Tin mới & Ưu đãi</span>
        </Link>

        {/* Vé của tôi */}
        <Link 
          href="#" 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider"
        >
          <Ticket size={14} className="text-red-500" />
          <span>Vé của tôi</span>
        </Link>

        {/* Ngăn cách dọc */}
        <div className="h-3 w-[1px] bg-white/10"></div>

        {/* Đăng nhập / Đăng ký */}
        <Link 
          href="/auth" 
          className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition-all text-xs font-bold uppercase tracking-widest"
        >
          <div className="p-1 bg-white/5 rounded-full border border-white/10 group-hover:border-red-500/50">
            <User size={14} />
          </div>
          <span>Đăng nhập / Đăng ký</span>
        </Link>
      </div>

      <style jsx>{`
        @keyframes ring {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }
        .group:hover :global(.animate-ring) {
          animation: ring 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}