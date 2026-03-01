import { Shield, Lock, Eye, EyeOff, Smartphone, Bell, ChevronRight, Fingerprint } from 'lucide-react';
import { useState } from 'react';

export default function SettingsTab() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Cài đặt bảo mật</h2>
        <div className="p-3 bg-red-600/10 rounded-2xl border border-red-600/20 text-red-500">
          <Shield size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* ĐỔI MẬT KHẨU */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/5">
                <Lock className="text-red-600" size={18} />
             </div>
             <div>
                <h4 className="text-sm font-black uppercase tracking-widest">Thay đổi mật khẩu</h4>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">Cập nhật mật khẩu định kỳ để bảo vệ vé và điểm của bạn</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Mật khẩu hiện tại</label>
              <div className="relative group">
                <input 
                  type={showPass ? "text" : "password"} 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-white" 
                  placeholder="••••••••"
                />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Mật khẩu mới</label>
              <input 
                type={showPass ? "text" : "password"} 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-white" 
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button className="bg-red-600 hover:bg-red-500 text-white font-black py-4 px-10 rounded-2xl transition-all uppercase tracking-[0.3em] text-[10px] shadow-lg shadow-red-600/20 active:scale-95">
            Xác nhận đổi mật khẩu
          </button>
        </div>

        {/* CÁC TÙY CHỌN KHÁC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thiết bị đang đăng nhập */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.08] transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 rounded-xl text-zinc-500 group-hover:text-red-500 transition-colors">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h5 className="text-[11px] font-black uppercase tracking-widest">Thiết bị đăng nhập</h5>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase">iPhone 15 Pro • HCM, VN</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-800 group-hover:text-white" />
            </div>

            {/* Thông báo ứng dụng */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.08] transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 rounded-xl text-zinc-500 group-hover:text-red-500 transition-colors">
                  <Bell size={20} />
                </div>
                <div>
                  <h5 className="text-[11px] font-black uppercase tracking-widest">Thông báo ưu đãi</h5>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase">Nhận tin tức & Voucher qua Mail</p>
                </div>
              </div>
              <div className="w-10 h-5 bg-red-600 rounded-full relative">
                 <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-md" />
              </div>
            </div>

            {/* FaceID / Vân tay */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.08] transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 rounded-xl text-zinc-500 group-hover:text-red-500 transition-colors">
                  <Fingerprint size={20} />
                </div>
                <div>
                  <h5 className="text-[11px] font-black uppercase tracking-widest">Xác thực sinh trắc học</h5>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase">Sử dụng FaceID để đặt vé nhanh</p>
                </div>
              </div>
              <div className="w-10 h-5 bg-zinc-800 rounded-full relative">
                 <div className="absolute left-1 top-1 w-3 h-3 bg-zinc-600 rounded-full shadow-md" />
              </div>
            </div>
        </div>

      </div>
    </div>
  );
}