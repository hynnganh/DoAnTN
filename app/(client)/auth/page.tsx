"use client";
import { useState } from "react";
import { 
  User, Phone, Mail, Lock, MapPin, Calendar, Eye, EyeOff, 
  ChevronDown, Check, ArrowRight, Fingerprint, ChevronLeft, ShieldCheck, Loader2 
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ForgotPasswordView = ({ onBack }: any) => {
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
    }, 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-700">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all tracking-[0.2em] group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Quay lại
      </button>

      {!isSent ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">Quên mật khẩu?</h2>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              Nhập email đăng ký, rạp phim sẽ gửi mã xác nhận để bạn đặt lại mật khẩu mới.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Email của bạn</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="example@gmail.com" 
                  className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-white" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Gửi mã xác nhận"}
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center py-10 animate-in zoom-in-95 duration-700">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
            <ShieldCheck className="text-green-500 animate-pulse" size={40} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">Kiểm tra Email</h2>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Chúng mình đã gửi hướng dẫn đặt lại mật khẩu vào hòm thư của bạn.</p>
          <button onClick={() => setIsSent(false)} className="text-[10px] font-black uppercase text-red-600 tracking-widest hover:text-white transition-colors">Gửi lại sau 60s</button>
        </div>
      )}
    </div>
  );
};

// --- MAIN AUTH PAGE ---
export default function AuthPage() {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPass, setShowPass] = useState(false);
  const [gender, setGender] = useState("male");

  // Helper để đổi view mượt mà
  const isLogin = view === 'login';

  return (
    <div className="min-h-screen flex bg-[#050505] text-white font-sans transition-all duration-500 overflow-x-hidden">
      
      {/* --- BÊN TRÁI: FORM SECTION --- */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 md:px-20 py-12 overflow-y-auto custom-scrollbar relative z-10">
        <div className="max-w-[480px] mx-auto w-full">
          
          {/* Logo Section */}
          <div className="mb-10 text-left">
             <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-2 select-none">
               A<span className="text-red-600">&</span>K <span className="text-2xl not-italic font-bold">Cinema</span>
            </h1>
          </div>

          {view !== 'forgot' ? (
            <div className="animate-in fade-in slide-in-from-left-6 duration-700">
              {/* Tabs */}
              <div className="flex gap-8 mb-10 border-b border-white/5 relative">
                <button 
                  onClick={() => setView('login')}
                  className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${isLogin ? "text-white" : "text-zinc-600 hover:text-zinc-400"}`}
                >
                  Đăng Nhập
                </button>
                <button 
                  onClick={() => setView('register')}
                  className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${view === 'register' ? "text-white" : "text-zinc-600 hover:text-zinc-400"}`}
                >
                  Đăng Ký
                </button>
                <div 
                  className={`absolute bottom-0 h-0.5 bg-red-600 transition-all duration-500 ease-out ${isLogin ? "left-0 w-[90px]" : "left-[120px] w-[80px]"}`} 
                />
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                
                {/* FIELDS CHO ĐĂNG KÝ */}
                {view === 'register' && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="col-span-2 md:col-span-1 space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">Tên của bạn</label>
                      <div className="relative group">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                        <input type="text" placeholder="Họ và tên" className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-white" />
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">Điện thoại</label>
                      <div className="relative group">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                        <input type="tel" placeholder="0xxx xxx xxx" className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-white" />
                      </div>
                    </div>
                  </div>
                )}

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">Địa chỉ Email</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                    <input type="email" placeholder="example@gmail.com" className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-white" />
                  </div>
                </div>

                {/* MẬT KHẨU */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">Mật khẩu</label>
                    {isLogin && (
                      <Link 
                        href="/auth/forgot-password" 
                        className="text-[10px] text-red-500 font-black uppercase hover:text-white transition-all tracking-tighter"
                      >
                        Quên mật khẩu?
                      </Link>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                    <input type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-white" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* BỔ SUNG CHO ĐĂNG KÝ */}
                {view === 'register' && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">Ngày sinh</label>
                        <div className="relative group">
                          <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                          <input type="date" className="w-full bg-white/5 border border-white/10 p-[13px] pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-zinc-400" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">Giới tính</label>
                        <div className="relative flex bg-white/5 rounded-2xl p-1 border border-white/10 h-[52px]">
                          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-red-600 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${gender === "female" ? "left-[calc(50%+2px)]" : "left-1"}`} />
                          <button type="button" onClick={() => setGender("male")} className={`relative z-10 flex-1 text-[11px] font-black uppercase transition-colors ${gender === "male" ? "text-white" : "text-zinc-500"}`}>Nam</button>
                          <button type="button" onClick={() => setGender("female")} className={`relative z-10 flex-1 text-[11px] font-black uppercase transition-colors ${gender === "female" ? "text-white" : "text-zinc-500"}`}>Nữ</button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">Rạp yêu thích (Sài Gòn)</label>
                      <div className="relative group">
                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                        <select className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-2xl outline-none focus:border-red-600 appearance-none cursor-pointer text-sm text-zinc-400 focus:text-white transition-all">
                          <option value="" className="bg-zinc-900">Chọn chi nhánh</option>
                          <optgroup label="Khu vực Trung Tâm" className="bg-zinc-900 text-red-500 font-bold">
                            <option value="q1" className="text-white">A&K Bitexco - Quận 1</option>
                            <option value="q3" className="text-white">A&K Lê Quý Đôn - Quận 3</option>
                          </optgroup>
                          <optgroup label="Khu vực Nội Thành" className="bg-zinc-900 text-red-500 font-bold">
                            <option value="q7" className="text-white">A&K Crescent Mall - Quận 7</option>
                            <option value="q10" className="text-white">A&K Vạn Hạnh Mall - Quận 10</option>
                            <option value="bt" className="text-white">A&K Landmark 81 - Bình Thạnh</option>
                          </optgroup>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group pt-2">
                      <div className="relative flex items-center justify-center min-w-[20px] h-[20px] border-2 border-white/10 rounded-md group-hover:border-red-600 transition-all overflow-hidden">
                        <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                        <Check size={14} className="text-white scale-0 peer-checked:scale-100 transition-transform bg-red-600 w-full h-full p-0.5" />
                      </div>
                      <span className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                        Tôi đồng ý nhận thông tin từ hệ thống và <span className="text-red-500 underline">Chính sách bảo mật</span>.
                      </span>
                    </label>
                  </div>
                )}

                <button className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl shadow-[0_15px_30px_-10px_rgba(220,38,38,0.3)] active:scale-[0.98] transition-all uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-2 mt-6 group">
                  {isLogin ? "Vào Rạp Ngay" : "Tạo Tài Khoản"}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          ) : (
            /* HIỆN VIEW QUÊN MẬT KHẨU */
            <ForgotPasswordView onBack={() => setView('login')} />
          )}

          {/* Social Login */}
          <div className="mt-12 text-center animate-in fade-in duration-1000">
            <div className="relative flex items-center justify-center mb-8">
              <div className="w-full border-t border-white/5"></div>
              <span className="absolute bg-[#050505] px-4 text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em]">Quick Connect</span>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 py-3.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center group">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 group-hover:scale-110 transition-transform" alt="Google" />
              </button>
              <button className="flex-1 py-3.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center group">
                 <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="h-5 group-hover:scale-110 transition-transform" alt="Facebook" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- BÊN PHẢI: DECORATIVE SECTION --- */}
      <div className="hidden lg:flex w-[45%] bg-[#080808] relative items-center justify-center p-20 overflow-hidden border-l border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
        
        <div className="relative z-10 text-center">
          <div className="relative w-[360px] h-[520px] mx-auto rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border border-white/10 group">
             <img 
              src={isLogin ? "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000" : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000"} 
              className="w-full h-full object-cover transition-all duration-[3000ms] ease-out group-hover:scale-110" 
              alt="Promotion" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
            <div className="absolute bottom-16 left-0 right-0 px-12 space-y-4">
               <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-600/40">
                <Fingerprint className="text-white" size={24} />
               </div>
               <h2 className="text-2xl font-black uppercase tracking-tighter text-white italic">
                 {isLogin ? "Welcome Back" : "Exclusive Perks"}
               </h2>
               <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                 {isLogin ? "Mở khóa những bộ phim bom tấn đỉnh cao cùng A&K." : "Đăng ký để nhận voucher bắp nước và ưu đãi IMAX giá sốc."}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Style */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}