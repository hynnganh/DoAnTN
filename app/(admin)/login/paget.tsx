"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter từ next/navigation
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Fingerprint } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Khởi tạo router

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Giả lập quá trình xác thực bảo mật
    setTimeout(() => {
      setLoading(false);
      toast.success("Xác thực thành công. Đang vào hệ thống...", {
        style: {
          borderRadius: '20px',
          background: '#18181b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.05)',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        },
      });

      // Chuyển hướng sang trang /admin sau 1.5 giây để user kịp nhìn thấy thông báo thành công
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      {/* ... Phần UI (giữ nguyên như cũ) ... */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-red-600/10 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="relative w-full max-w-[480px] z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-zinc-900 border border-white/5 shadow-2xl mb-4 group hover:border-red-600/50 transition-all duration-500">
            <ShieldCheck size={40} className="text-red-600 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-white">
            Admin <span className="text-red-600">Portal</span>
          </h1>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-10 md:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
          <form onSubmit={handleLogin} className="space-y-8">
            {/* Input Username & Password như cũ */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-5">Tài khoản</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors"><User size={18} /></div>
                <input type="text" required className="w-full h-16 bg-black border border-white/5 rounded-full pl-14 pr-6 text-sm text-white focus:outline-none focus:border-red-600/50 transition-all" placeholder="admin_ak_cinema"/>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-5">Mật mã</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors"><Lock size={18} /></div>
                <input type={showPassword ? "text" : "password"} required className="w-full h-16 bg-black border border-white/5 rounded-full pl-14 pr-14 text-sm text-white focus:outline-none focus:border-red-600/50 transition-all" placeholder="••••••••"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all duration-500 shadow-xl group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Truy cập hệ thống <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}