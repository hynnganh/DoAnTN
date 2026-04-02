"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Ticket, CreditCard, Heart, Settings, LogOut, Camera, Loader2, Crown } from 'lucide-react';
import Cookies from 'js-cookie';
import { apiRequest } from '@/app/lib/api';

const menuItems = [
  { id: 'info', label: 'Hồ sơ cá nhân', icon: User },
  { id: 'tickets', label: 'Vé của tôi', icon: Ticket },
  { id: 'payment', label: 'Lịch sử giao dịch', icon: CreditCard },
  { id: 'wishlist', label: 'Phim yêu thích', icon: Heart },
  { id: 'settings', label: 'Thiết lập', icon: Settings },
];

export default function UserSidebar({ activeTab, setActiveTab }: any) {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch thông tin User đang đăng nhập
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        const res = await apiRequest('/api/v1/users/me');

        if (res.ok) {
          const result = await res.json();
          // Hứng data linh hoạt (phòng trường hợp BE bọc data/user)
          const data = result.data?.user || result.data || result;
          setUserData(data);
        }
      } catch (err) {
        console.error("Lỗi tải thông tin user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  // 2. Hàm đăng xuất sạch sẽ
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    Cookies.remove('role');
    router.push('/login');
    router.refresh(); 
  };

  return (
    <aside className="w-full lg:w-80 bg-[#050505] border-r border-white/5 p-8 flex flex-col shrink-0 z-20 min-h-[calc(100vh-80px)]">
      
      {/* Profile Section */}
      <div className="mb-10 text-center lg:text-left">
        <div className="relative w-28 h-28 mx-auto lg:mx-0 mb-6 group">
          {loading ? (
            <div className="w-full h-full rounded-[2.5rem] bg-zinc-900 flex items-center justify-center animate-pulse">
              <Loader2 className="animate-spin text-red-600" size={24} />
            </div>
          ) : (
            <>
              <img 
                src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.lastName || 'U'}&background=random&color=fff`} 
                className="w-full h-full object-cover rounded-[2.5rem] border-2 border-red-600/20 p-1.5 shadow-2xl shadow-red-600/10" 
                alt="User Avatar" 
              />
              <button className="absolute bottom-1 right-1 bg-red-600 p-2 rounded-xl border-4 border-[#050505] hover:scale-110 transition-transform">
                <Camera size={14} className="text-white" />
              </button>
            </>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black uppercase tracking-tight italic text-white line-clamp-1">
            {loading ? "Đang kết nối..." : `${userData?.firstName || ''} ${userData?.lastName || 'Thành viên'}`}
          </h3>
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <Crown size={12} className="text-yellow-500 fill-yellow-500" />
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                Thành viên Bạc
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1.5 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl shadow-red-600/20' 
                : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200'
            }`}
          >
            <item.icon size={18} className={activeTab === item.id ? 'animate-pulse' : 'group-hover:text-red-500'} />
            <span className="text-[11px] font-black uppercase tracking-[0.15em]">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="mt-8 flex items-center gap-4 px-6 py-5 text-zinc-600 hover:text-red-500 transition-all border-t border-white/5 pt-8 group uppercase text-[11px] font-black"
      >
        <div className="p-2 rounded-lg group-hover:bg-red-500/10 transition-colors">
            <LogOut size={18} />
        </div>
        Rời khỏi hệ thống
      </button>
    </aside>
  );
}