"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Mail, Loader2, RefreshCw, 
  Fingerprint, User, ShieldCheck, Phone, Calendar
} from 'lucide-react';
import { apiRequest } from '@/app/lib/api'; 
import toast, { Toaster } from 'react-hot-toast';

export default function TrangQuanLyKhachHang() {
  const [danhSachUser, setDanhSachUser] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState("");

  // 1. Lấy dữ liệu từ API
  const layDuLieuUser = async () => {
    try {
      setDangTai(true);
      const res = await apiRequest('/api/v1/users');
      const ketQua = await res.json();
      
      if (res.ok) {
        // FIX: Theo JSON bạn gửi, dữ liệu nằm trong ketQua.data.content
        const data = ketQua.data?.content || [];
        setDanhSachUser(data);
      } else {
        toast.error("Không có quyền truy cập dữ liệu!");
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

  // 2. Hàm render hàng dữ liệu (Fix logic Role từ String Array)
  const renderHangDuLieu = () => {
    const cacHang = [];
    
    for (let i = 0; i < danhSachUser.length; i++) {
      const u = danhSachUser[i];
      if (!u) continue;

      // FIX: Check role dựa trên mảng String ["ROLE_USER", ...]
      let laKhachHang = false;
      if (u.roles && Array.isArray(u.roles)) {
        for (let j = 0; j < u.roles.length; j++) {
          if (u.roles[j] === 'ROLE_USER') {
            laKhachHang = true;
            break; 
          }
        }
      }

      // Chỉ hiện những người có quyền USER
      if (!laKhachHang) continue;

      // Logic tìm kiếm
      const hoTen = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      const sdt = (u.mobileNumber || '');
      const tuKhoa = tuKhoaTimKiem.toLowerCase();

      const khopTimKiem = hoTen.includes(tuKhoa) || email.includes(tuKhoa) || sdt.includes(tuKhoa);

      if (khopTimKiem) {
        cacHang.push(
          <tr key={u.userId} className="hover:bg-white/[0.01] transition-all group border-b border-white/5">
            <td className="p-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center font-black text-red-600 text-2xl italic shadow-md group-hover:border-red-600/50 transition-all overflow-hidden">
                  {u.avatar ? (
                    <img src={u.avatar} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    u.firstName?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div>
                  <p className="font-black uppercase italic text-sm text-white tracking-tight group-hover:text-red-500 transition-colors">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-[10px] text-zinc-600 font-bold mt-1 flex items-center gap-1 uppercase tracking-tighter">
                     <Fingerprint size={10} className="text-red-600" /> ID: {u.userId}
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
                  <Phone size={10} /> {u.mobileNumber || 'Chưa cập nhật'}
                </div>
              </div>
            </td>

            <td className="p-8">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black text-zinc-300 uppercase italic tracking-widest">
                   {u.gender === 'MALE' ? 'Nam' : u.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                </span>
                <span className="text-[9px] text-zinc-600 font-bold flex items-center gap-1">
                   <Calendar size={10} /> 
                   {u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString('vi-VN') : '---'}
                </span>
              </div>
            </td>

            <td className="p-8 text-right">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/5 border border-red-600/20 rounded-xl">
                  <ShieldCheck size={12} className="text-red-600" />
                  <span className="text-[10px] font-[1000] text-red-600 uppercase tracking-widest italic">USER</span>
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
            Không tìm thấy khách hàng nào
          </td>
        </tr>
      );
    }

    return cacHang;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-3 font-sans">
      <Toaster position="top-right" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 px-5">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-600/10 rounded-3xl border border-red-600/20">
            <User className="text-red-600" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter leading-none">
              QUẢN LÝ <span className="text-red-600">KHÁCH HÀNG</span>
            </h1>
            <p className="text-zinc-500 font-black uppercase text-[9px] tracking-[0.4em] mt-2 italic">A&K • Membership Database</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800" size={16} />
            <input 
              type="text" 
              placeholder="Tìm theo tên, email, sdt..." 
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-red-600/50 transition-all"
              onChange={(e) => setTuKhoaTimKiem(e.target.value)}
            />
          </div>
          <button onClick={layDuLieuUser} className="p-4 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-white hover:text-black transition-all">
            <RefreshCw size={18} className={dangTai ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-zinc-900/30 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl mx-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Hồ sơ</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Thông tin liên hệ</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Định danh</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest text-right">Cấp bậc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dangTai ? (
                <tr>
                  <td colSpan={4} className="p-32 text-center">
                    <Loader2 className="animate-spin text-red-600 mx-auto" size={40} />
                  </td>
                </tr>
              ) : (
                renderHangDuLieu()
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}