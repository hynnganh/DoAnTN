"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Mail, Loader2, RefreshCw, 
  Fingerprint, User, ShieldCheck, Phone, Calendar
} from 'lucide-react';

export default function TrangQuanLyKhachHang() {
  const [danhSachUser, setDanhSachUser] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState("");

  // Hàm gọi API lấy dữ liệu
  const layDuLieuUser = async () => {
    try {
      setDangTai(true);
      const token = localStorage.getItem('token');
      
      const res = await fetch('http://localhost:8080/api/v1/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const ketQua = await res.json();
      
      if (res.ok) {
        // Kiểm tra cấu trúc trả về từ Spring Boot (Data Transfer Object)
        const data = ketQua.data?.content || ketQua.data || [];
        setDanhSachUser(data);
      }
    } catch (err) {
      console.error("Lỗi hệ thống khi tải dữ liệu");
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    layDuLieuUser();
  }, []);

  // --- HÀM XỬ LÝ HIỂN THỊ (DÙNG VÒNG LẶP FOR THEO Ý BÀ) ---
  const renderHangDuLieu = () => {
    const cacHang = [];
    
    for (let i = 0; i < danhSachUser.length; i++) {
      const u = danhSachUser[i];

      // 1. Kiểm tra quyền ROLE_USER (Duyệt qua mảng roles từ Entity Role của bà)
      let laKhachHang = false;
      if (u.roles) {
        for (let j = 0; j < u.roles.length; j++) {
          // Khớp chính xác với trường roleName trong class Role của bà
          if (u.roles[j].roleName === 'ROLE_USER') {
            laKhachHang = true;
            break;
          }
        }
      }

      // 2. Logic tìm kiếm (Tên hoặc Email)
      const hoTen = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      const timThay = hoTen.includes(tuKhoaTimKiem.toLowerCase()) || 
                      u.email?.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());

      // 3. Chỉ thêm vào danh sách nếu là Khách hàng và khớp từ khóa
      if (laKhachHang && timThay) {
        cacHang.push(
          <tr key={u.userId} className="hover:bg-white/[0.01] transition-all group border-b border-white/5">
            <td className="p-8">
              <div className="flex items-center gap-5">
                {/* Ảnh đại diện hoặc chữ cái đầu */}
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center font-black text-red-600 text-2xl italic shadow-md group-hover:border-red-600/50 transition-all">
                  {u.avatar ? (
                    <img src={u.avatar} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    u.firstName?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <p className="font-black uppercase italic text-sm text-white tracking-tight group-hover:text-red-500 transition-colors">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-[10px] text-zinc-600 font-bold mt-1 flex items-center gap-1 uppercase">
                     <Fingerprint size={10} className="text-red-600" /> MÃ SỐ: AK-{u.userId}
                  </p>
                </div>
              </div>
            </td>

            <td className="p-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-red-600" />
                  <p className="text-[13px] text-zinc-400 font-bold">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500 ml-5 italic">
                  <Phone size={10} /> {u.mobileNumber || 'Chưa cập nhật số'}
                </div>
              </div>
            </td>

            <td className="p-8">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black text-zinc-300 uppercase italic tracking-widest">
                   {u.gender === 'Male' ? 'Nam' : u.gender === 'Female' ? 'Nữ' : 'Khác'}
                </span>
                <span className="text-[9px] text-zinc-600 font-bold flex items-center gap-1">
                   <Calendar size={10} /> {u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString('vi-VN') : '---'}
                </span>
              </div>
            </td>

            <td className="p-8 text-right">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-[1000] text-emerald-500 uppercase tracking-widest">Khách hàng</span>
               </div>
            </td>
          </tr>
        );
      }
    }

    if (cacHang.length === 0 && !dangTai) {
      return (
        <tr>
          <td colSpan={4} className="p-32 text-center opacity-20 italic font-black uppercase tracking-[0.5em] text-zinc-500 text-xs">
            Không có khách hàng nào được tìm thấy
          </td>
        </tr>
      );
    }

    return cacHang;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 font-sans selection:bg-red-600/30">
      
      {/* Phần đầu trang */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-600/10 rounded-3xl border border-red-600/20 shadow-[0_0_20px_rgba(220,38,38,0.15)]">
            <User className="text-red-600" size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter leading-none">
              DỮ LIỆU <span className="text-red-600">KHÁCH HÀNG</span>
            </h1>
            <p className="text-zinc-500 font-black uppercase text-[9px] tracking-[0.4em] mt-2 italic">Hệ thống A&K • Chế độ chỉ xem</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm danh tính khách hàng..." 
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-800"
              onChange={(e) => setTuKhoaTimKiem(e.target.value)}
            />
          </div>
          <button 
            onClick={layDuLieuUser} 
            className="p-4 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-white hover:text-black transition-all group active:scale-95 shadow-lg"
          >
            <RefreshCw size={18} className={dangTai ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
          </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-zinc-900/30 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Định danh khách hàng</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Thông tin liên lạc</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Chi tiết cá nhân</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest text-right">Phân quyền</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/5">
              {dangTai ? (
                <tr>
                  <td colSpan={4} className="p-32 text-center">
                    <Loader2 className="animate-spin text-red-600 mx-auto" size={40} />
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Hệ thống đang truy xuất...</p>
                  </td>
                </tr>
              ) : (
                renderHangDuLieu()
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center mt-12 text-zinc-800 text-[9px] font-black uppercase tracking-[0.5em] italic">
        A&K System Control Panel • Unauthorized modification is prohibited
      </p>
    </div>
  );
}