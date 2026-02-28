"use client";
import React from "react";
import { Sparkles } from "lucide-react";

export default function TopBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-red-700 py-1.5 shadow-md">
      {/* Hiệu ứng ánh sáng chạy ngang qua banner */}
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] animate-shimmer" />

      <div className="relative flex items-center justify-center gap-3 text-white">
        <Sparkles size={14} className="animate-pulse text-yellow-300" />
        
        <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
          <span>Ưu đãi đặc biệt:</span>
          <span className="bg-white text-red-600 px-2 py-0.5 rounded-sm animate-bounce shadow-sm">
            GIẢM 50%
          </span>
          <span className="hidden sm:inline">Giá vé cho lần đặt đầu tiên</span>
        </p>

        <Sparkles size={14} className="animate-pulse text-yellow-300" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
      `}</style>
    </div>
  );
}