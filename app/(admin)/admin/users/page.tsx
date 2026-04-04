"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Mail, Loader2, RefreshCw, 
  Fingerprint, User, ShieldCheck, Phone, Calendar
} from 'lucide-react';
import { apiRequest } from '@/app/lib/api'; // Tái sử dụng helper để xử lý Token
import toast, { Toaster } from 'react-hot-toast';

export default function TrangQuanLyKhachHang() {
  const [danhSachUser, setDanhSachUser] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState("");

  // 1. Hàm gọi API lấy dữ liệu dùng apiRequest cho đồng bộ
  const layDuLieuUser = async () => {
    try {
      setDangTai(true);
      const res = await apiRequest('/api/v1/users');
      const ketQua = await res.json();
      
      if (res.ok) {
        // Xử lý linh hoạt các cấu trúc trả về từ Spring Boot (Pageable hoặc List)
        const data = ketQua.data?.content || ketQua.data || ketQua || [];
        setDanhSachUser(data);
      } else {
        toast.error("Không có quyền truy cập dữ liệu người dùng!");
      }
    } catch (err) {
      console.error("Lỗi hệ thống:", err);
      toast.error("Lỗi kết nối máy chủ!");
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    layDuLieuUser();
  }, []);

  // 2. Hàm xử lý hiển thị dùng vòng lặp FOR để lọc ROLE_USER
  const renderHangDuLieu = () => {
    const cacHang = [];
    
    for (let i = 0; i < danhSachUser.length; i++) {
      const u = danhSachUser[i];
      if (!u) continue;

      // Kiểm tra quyền ROLE_USER bằng vòng lặp for thứ hai
      let laKhachHang = false;
      if (u.roles && Array.isArray(u.roles)) {
        for (let j = 0; j < u.roles.length; j++) {
          if (u.roles[j].roleName === 'ROLE_USER') {
            laKhachHang = true;
            break; 
          }
        }
      }

      // Nếu không phải ROLE_USER thì bỏ qua, không cần check tìm kiếm nữa
      if (!laKhachHang) continue;

      // Logic tìm kiếm: Tên, Email hoặc Số điện thoại
      const hoTen = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      const sdt = (u.mobileNumber || '');
      const tuKhoa = tuKhoaTimKiem.toLowerCase();

      const khớpTimKiem = hoTen.includes(tuKhoa) || email.includes(tuKhoa) || sdt.includes(tuKhoa);

      if (khớpTimKiem) {
        cacHang.push(
          <tr key={u.userId} className="hover:bg-white/[0.01] transition-all group border-b border-white/5">
            <td className="p-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center font-black text-red-600 text-2xl italic shadow-md group-hover:border-red-600/50 transition-all overflow-hidden">
                  {u.avatar ? (
                    <img src={u.avatar} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    u.firstName?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <p className="font-black uppercase italic text-sm text-white tracking-tight group-hover:text-red-500 transition-colors">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-[10px] text-zinc-600 font-bold mt-1 flex items-center gap-1 uppercase tracking-tighter">
                     <Fingerprint size={10} className="text-red-600" /> ID: AK-{u.userId}
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
                  <span className="text-[10px] font-[1000] text-emerald-500 uppercase tracking-widest italic">Khách hàng</span>
               </div>
            </td>
          </tr>
        );
      }
    }

    // Hiển thị trạng thái trống nếu không tìm thấy ai
    if (cacHang.length === 0 && !dangTai) {
      return (
        <tr>
          <td colSpan={4} className="p-32 text-center opacity-20 italic font-black uppercase tracking-[0.5em] text-zinc-500 text-xs">
            Không tìm thấy khách hàng nào
          </td>
        </tr>
      );
    }

    return cacHang;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-3 font-sans selection:bg-red-600/30">
      <Toaster position="top-right" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-600/10 rounded-3xl border border-red-600/20 shadow-[0_0_20px_rgba(220,38,38,0.15)]">
            <User className="text-red-600" size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter leading-none">
              DỮ LIỆU <span className="text-red-600">KHÁCH HÀNG</span>
            </h1>
            <p className="text-zinc-500 font-black uppercase text-[9px] tracking-[0.4em] mt-2 italic">Hệ thống quản trị A&K • Danh sách người dùng</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm danh tính..." 
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-800"
              onChange={(e) => setTuKhoaTimKiem(e.target.value)}
            />
          </div>
          <button 
            onClick={layDuLieuUser} 
            className="p-4 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-white hover:text-black transition-all group shadow-lg"
          >
            <RefreshCw size={18} className={dangTai ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
          </button>
        </div>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="bg-zinc-900/30 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Khách hàng</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Liên hệ</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Cá nhân</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest text-right">Quyền hạn</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/5">
              {dangTai ? (
                <tr>
                  <td colSpan={4} className="p-32 text-center">
                    <Loader2 className="animate-spin text-red-600 mx-auto" size={40} />
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-700 italic">Đang tải dữ liệu khách hàng...</p>
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
        A&K System Management • 2026 Admin Panel
      </p>
    </div>
  );
}