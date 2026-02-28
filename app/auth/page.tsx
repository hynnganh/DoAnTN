"use client";
import { useState } from "react";
import { User, Phone, Mail, Lock, MapPin, Calendar, Eye, EyeOff, ChevronDown, Check, ArrowRight, Fingerprint } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false); // Chuyển đổi giữa Đăng Nhập/Đăng Ký
  const [showPass, setShowPass] = useState(false);
  const [gender, setGender] = useState("male");

  return (
    <div className="min-h-screen flex bg-[#050505] text-white font-sans transition-all duration-500">
      
      {/* --- BÊN TRÁI: FORM SECTION --- */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 md:px-20 py-12 overflow-y-auto custom-scrollbar relative z-10">
        <div className="max-w-[500px] mx-auto w-full">
          
          {/* Header & Tabs */}
          <div className="mb-10">
             <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-2">
              A<span className="text-red-600">&</span>K <span className="text-2xl not-italic font-bold">Cinema</span>
            </h1>
            
            <div className="flex gap-8 mt-8 border-b border-white/10 relative">
              <button 
                onClick={() => setIsLogin(true)}
                className={`pb-4 text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 ${isLogin ? "text-white" : "text-gray-600 hover:text-gray-400"}`}
              >
                Đăng Nhập
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`pb-4 text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 ${!isLogin ? "text-white" : "text-gray-600 hover:text-gray-400"}`}
              >
                Đăng Ký
              </button>
              {/* Thanh trượt dưới tab */}
              <div 
                className={`absolute bottom-0 h-0.5 bg-red-600 transition-all duration-500 ease-out ${isLogin ? "left-0 w-[95px]" : "left-[125px] w-[80px]"}`} 
              />
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* CÁC TRƯỜNG CHỈ HIỆN KHI ĐĂNG KÝ */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Tên của bạn</label>
                  <div className="relative group">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                    <input type="text" placeholder="Họ và tên" className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-sm" />
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Số điện thoại</label>
                  <div className="relative group">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                    <input type="tel" placeholder="0xxx xxx xxx" className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* EMAIL (Cả 2 đều cần) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Địa chỉ Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                <input type="email" placeholder="example@gmail.com" className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-sm" />
              </div>
            </div>

            {/* MẬT KHẨU */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Mật khẩu</label>
                {isLogin && (
                  <button type="button" className="text-[10px] text-red-500 font-bold uppercase hover:underline transition-all">Quên mật khẩu?</button>
                )}
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                <input type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CÁC TRƯỜNG BỔ SUNG KHI ĐĂNG KÝ */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Ngày sinh</label>
                  <div className="relative group">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                    <input type="date" className="w-full bg-white/5 border border-white/10 p-[13px] pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-sm" />
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Giới tính</label>
                  <div className="relative flex bg-white/5 rounded-2xl p-1 border border-white/10 h-[52px]">
                    <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-red-600 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${gender === "female" ? "left-[calc(50%+2px)]" : "left-1"}`} />
                    <button type="button" onClick={() => setGender("male")} className={`relative z-10 flex-1 text-[11px] font-black uppercase transition-colors ${gender === "male" ? "text-white" : "text-gray-500"}`}>Nam</button>
                    <button type="button" onClick={() => setGender("female")} className={`relative z-10 flex-1 text-[11px] font-black uppercase transition-colors ${gender === "female" ? "text-white" : "text-gray-500"}`}>Nữ</button>
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
    Rạp yêu thích (Khu vực Sài Gòn)
  </label>
  <div className="relative group">
    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" />
    
    <select className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-2xl outline-none focus:border-red-600 appearance-none cursor-pointer text-sm text-gray-300 focus:text-white transition-all">
      <option className="bg-[#111]" value="">Chọn chi nhánh gần bạn nhất</option>
      
      {/* Khu vực Trung Tâm */}
      <optgroup label="Khu vực Trung Tâm" className="bg-[#111] text-red-500 font-bold">
        <option className="text-white" value="q1">A&K Bitexco - Quận 1</option>
        <option className="text-white" value="q1-2">A&K Mạc Đĩnh Chi - Quận 1</option>
        <option className="text-white" value="q3">A&K Lê Quý Đôn - Quận 3</option>
        <option className="text-white" value="q5">A&K Hùng Vương Plaza - Quận 5</option>
      </optgroup>

      {/* Khu vực Nội Thành */}
      <optgroup label="Khu vực Nội Thành" className="bg-[#111] text-red-500 font-bold">
        <option className="text-white" value="q2">A&K Thảo Điền - Quận 2 (TP. Thủ Đức)</option>
        <option className="text-white" value="q4">A&K Khánh Hội - Quận 4</option>
        <option className="text-white" value="q6">A&K Bình Phú - Quận 6</option>
        <option className="text-white" value="q7">A&K Crescent Mall - Quận 7</option>
        <option className="text-white" value="q8">A&K Central Premium - Quận 8</option>
        <option className="text-white" value="q10">A&K Vạn Hạnh Mall - Quận 10</option>
        <option className="text-white" value="q11">A&K Lãnh Binh Thăng - Quận 11</option>
        <option className="text-white" value="q12">A&K Hiệp Thành - Quận 12</option>
      </optgroup>

      {/* Các Quận/Huyện khác */}
      <optgroup label="Khu vực Mở Rộng" className="bg-[#111] text-red-500 font-bold">
        <option className="text-white" value="bt">A&K Landmark 81 - Bình Thạnh</option>
        <option className="text-white" value="gv">A&K Quang Trung - Gò Vấp</option>
        <option className="text-white" value="pn">A&K Phan Xích Long - Phú Nhuận</option>
        <option className="text-white" value="tb">A&K Cộng Hòa - Tân Bình</option>
        <option className="text-white" value="tp">A&K Aeon Mall - Tân Phú</option>
        <option className="text-white" value="bc">A&K Trung Sơn - Bình Chánh</option>
        <option className="text-white" value="btan">A&K Kinh Dương Vương - Bình Tân</option>
        <option className="text-white" value="hm">A&K Bà Điểm - Hóc Môn</option>
        <option className="text-white" value="nh">A&K Hiệp Phước - Nhà Bè</option>
        <option className="text-white" value="cc">A&K Củ Chi - Củ Chi</option>
      </optgroup>
    </select>

    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none group-focus-within:text-red-500 transition-colors" />
  </div>
</div>

                <div className="col-span-2 mt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center min-w-[20px] h-[20px] border-2 border-white/20 rounded-md group-hover:border-red-600 transition-all overflow-hidden">
                      <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                      <Check size={14} className="text-white scale-0 peer-checked:scale-100 transition-transform bg-red-600 w-full h-full p-0.5" />
                    </div>
                    <span className="text-[11px] text-gray-500 leading-relaxed">
                      Tôi đồng ý nhận thông tin quảng cáo và xử lý dữ liệu theo <span className="text-red-500 underline">Chính sách bảo mật</span>.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-[0_10px_25px_-10px_rgba(220,38,38,0.5)] active:scale-[0.98] transition-all uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-2 mt-4 group">
              {isLogin ? "Đăng Nhập Ngay" : "Hoàn Tất Đăng Ký"}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* SOCIAL LOGIN (Cho cả 2) */}
          <div className="mt-10 text-center">
            <div className="relative flex items-center justify-center mb-8">
              <div className="w-full border-t border-white/5"></div>
              <span className="absolute bg-[#050505] px-4 text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">Hoặc kết nối qua</span>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5" alt="Google" />
              </button>
              <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center">
                 <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="h-5" alt="Facebook" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- BÊN PHẢI: DECORATIVE SECTION --- */}
      <div className="hidden lg:flex w-[45%] bg-[#0a0a0a] relative items-center justify-center p-20 overflow-hidden border-l border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
        
        <div className="relative z-10 text-center space-y-8">
          <div className="relative w-[340px] h-[480px] mx-auto rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)] border border-white/10 group">
             <img 
              src={isLogin ? "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000" : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000"} 
              className="w-full h-full object-cover transition-all duration-[2000ms] group-hover:scale-110" 
              alt="Promotion" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-0 right-0 px-10">
               <Fingerprint className="text-red-600 mx-auto mb-4" size={32} />
               <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 text-white">
                 {isLogin ? "Chào mừng trở lại" : "Đặc quyền thành viên"}
               </h2>
               <p className="text-gray-400 text-xs leading-relaxed font-medium">
                 {isLogin ? "Tiếp tục trải nghiệm những bộ phim bom tấn tại hệ thống rạp A&K." : "Đăng ký để nhận ngay bắp nước miễn phí và giảm 50% giá vé lần đầu."}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}