"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Ticket, Bell, Settings, CreditCard, LogOut, ChevronDown, ShieldCheck, Loader2 } from "lucide-react";

export default function TopMenu() {
  // 1. State lưu trữ User với đầy đủ các trường từ Backend (giống InfoTab)
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Gọi API lấy thông tin mới nhất giống InfoTab để fix lỗi tên/role
        const res = await fetch('http://localhost:8080/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (res.ok) {
          const result = await res.json();
          // Logic lấy data chuẩn theo cấu trúc Backend của bà
          const rawData = result.data?.user || result.data || result;
          setUser(rawData);
          
          // Cập nhật lại localStorage để các trang khác dùng chung bản mới nhất
          localStorage.setItem("user_info", JSON.stringify(rawData));
        } else {
          // Nếu token hết hạn hoặc lỗi, xóa data cũ
          localStorage.removeItem("user_info");
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Lỗi đồng bộ TopMenu:", err);
        // Fallback: Nếu lỗi mạng thì dùng tạm đồ cũ trong localStorage
        const stored = localStorage.getItem("user_info");
        if (stored) setUser(JSON.parse(stored));
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    window.location.href = "/";
  };

  // Logic kiểm tra Role chuẩn (Dựa trên 3 bảng User-Role-UserRole)
  const isSuperAdmin = user?.roles?.some((r: any) => r.roleName === 'ROLE_SUPER_ADMIN');
  const isAdmin = user?.roles?.some((r: any) => r.roleName === 'ROLE_ADMIN');

  return (
    <div className="bg-black border-b border-white/10 relative z-[999]">
      <div className="max-w-[1440px] mx-auto flex justify-end items-center gap-8 px-6 md:px-12 py-2.5">
        
        {/* --- Link tiện ích --- */}
        <div className="flex items-center gap-6">
          <Link href="/news" className="flex items-center gap-2 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-widest group transition-all">
            <Bell size={14} className="text-red-600 group-hover:animate-bounce" />
            <span>Tin mới</span>
          </Link>

          <Link href="/my-tickets" className="flex items-center gap-2 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-widest group transition-all">
            <Ticket size={14} className="text-red-600 group-hover:scale-110 transition-transform" />
            <span>Vé của tôi</span>
          </Link>
        </div>

        <div className="h-3 w-[1px] bg-white/20"></div>

        {/* --- KHU VỰC USER --- */}
        {loading ? (
          <div className="flex items-center gap-2 opacity-50">
            <Loader2 size={14} className="animate-spin text-red-600" />
            <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Đang tải...</span>
          </div>
        ) : user ? (
          <div className="relative group py-1">
            <div className="flex items-center gap-4 cursor-pointer select-none">
              
              {/* Hiển thị Tên và Badge Role */}
              <div className="flex flex-col items-end leading-none gap-1">
                <span className="text-[11px] font-[1000] text-zinc-100 group-hover:text-red-500 transition-all uppercase tracking-[0.15em] italic border-b border-red-600/20 pb-0.5">
                  {user.firstName} {user.lastName}
                </span>
                
                {/* Badge phân biệt cấp bậc dựa trên mảng Roles */}
                {isSuperAdmin ? (
                  <span className="text-[7px] font-black bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded tracking-widest uppercase shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                    Super Admin
                  </span>
                ) : isAdmin ? (
                  <span className="text-[7px] font-black bg-red-600/10 text-red-600 border border-red-600/20 px-1.5 py-0.5 rounded tracking-widest uppercase">
                    System Admin
                  </span>
                ) : (
                  <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest opacity-60">
                    Hội viên A&K
                  </span>
                )}
              </div>
              
              {/* Avatar với hiệu ứng Hover */}
              <div className="relative w-9 h-9 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden group-hover:border-red-600 transition-all shadow-xl">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="avatar" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as any).src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=ef4444&color=fff&bold=true`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white bg-gradient-to-br from-zinc-800 to-black group-hover:from-red-600 group-hover:to-red-800 transition-all">
                    <span className="text-[10px] font-black">{user.firstName?.charAt(0)}</span>
                  </div>
                )}
              </div>
              <ChevronDown size={12} className="text-zinc-500 group-hover:text-red-500 group-hover:rotate-180 transition-all duration-300" />
            </div>

            {/* --- MENU THẢ XUỐNG (Bản Nhỏ Gọn) --- */}
<div className="absolute right-0 mt-2 w-52 
                bg-zinc-950/90 backdrop-blur-md 
                border border-white/10 rounded-2xl 
                shadow-[0_10px_30px_rgba(0,0,0,0.5)] 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                group-hover:translate-y-0 translate-y-2 
                transition-all duration-300 ease-out 
                z-[110] overflow-hidden">
  
  {/* Header nhỏ xinh */}
  <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em]">Hội viên A&K</p>
  </div>
  
  <div className="p-1.5">
    {/* Item: Thông tin - Thu nhỏ padding và icon */}
    <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 group/item transition-all">
      <div className="p-2 bg-zinc-900 rounded-lg group-hover/item:bg-red-600 group-hover/item:text-white transition-all text-red-600">
        <Settings size={14} />
      </div>
      <span className="text-[10px] font-bold text-zinc-400 group-hover/item:text-white uppercase tracking-wider">Cài đặt</span>
    </Link>

    {/* Item: Giao dịch */}
    <Link href="/my-tickets" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 group/item transition-all">
      <div className="p-2 bg-zinc-900 rounded-lg group-hover/item:bg-red-600 group-hover/item:text-white transition-all text-red-600">
        <CreditCard size={14} />
      </div>
      <span className="text-[10px] font-bold text-zinc-400 group-hover/item:text-white uppercase tracking-wider">Giao dịch</span>
    </Link>

    {/* Admin Access - Tinh gọn */}
    {(isAdmin || isSuperAdmin) && (
      <Link href="/admin" className="mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-600/5 border border-red-600/10 hover:bg-red-600 group/admin transition-all">
        <ShieldCheck size={14} className="text-red-600 group-hover/admin:text-white" />
        <span className="text-[10px] font-black text-red-600 group-hover/admin:text-white uppercase tracking-widest">Admin</span>
      </Link>
    )}
  </div>

  {/* Logout Button - Chiều cao thấp hơn */}
  <button 
    onClick={handleLogout}
    className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all border-t border-white/5 group/logout"
  >
    <LogOut size={13} className="group-hover/logout:translate-x-0.5 transition-transform" />
    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Đăng xuất</span>
  </button>
</div>
          </div>
        ) : (
          /* --- Phần khi chưa đăng nhập --- */
          <Link href="/auth" className="flex items-center gap-3 text-zinc-300 hover:text-red-500 transition-all text-[11px] font-black uppercase tracking-[0.2em] group">
            <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 group-hover:border-red-600 transition-all">
              <User size={14} />
            </div>
            <span>Đăng nhập / Đăng ký</span>
          </Link>
        )}
      </div>
    </div>
  );
}