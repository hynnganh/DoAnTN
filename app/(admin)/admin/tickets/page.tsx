"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Ticket, Calendar, Armchair, 
  Filter, Loader2, RefreshCw, Eye,
  CheckCircle2, Clock, XCircle, ChevronRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function QuanLyDonHangPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/v1/bookings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await res.json();
      if (res.ok) {
        setBookings(result.data || []);
      }
    } catch (err) {
      toast.error("Lỗi tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // Logic lọc dữ liệu
  const filteredData = bookings.filter(b => {
    const matchesSearch = 
      b.bookingId?.toString().includes(searchTerm) || 
      b.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.showtime?.movie?.movieName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "ALL" || b.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 font-sans selection:bg-red-600/30">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-zinc-900 rounded-3xl border border-white/5 shadow-xl text-red-600">
            <Ticket size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter leading-none">
              QUẢN LÝ <span className="text-red-600">ĐƠN HÀNG</span>
            </h1>
            <p className="text-zinc-500 font-black uppercase text-[9px] tracking-[0.4em] mt-2 italic">Lịch sử đặt vé toàn hệ thống</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input 
              type="text" 
              placeholder="Tìm mã đơn, tên phim hoặc khách hàng..." 
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-red-600/50 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-zinc-900 border border-white/5 rounded-2xl py-4 px-4 text-[10px] font-black uppercase outline-none cursor-pointer"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="PENDING">Chờ thanh toán</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
          <button onClick={fetchBookings} className="p-4 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-white hover:text-black transition-all group">
            <RefreshCw size={18} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
          </button>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-zinc-900/30 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Đơn hàng</th>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Phim & Suất chiếu</th>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Chi tiết vé</th>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Thanh toán</th>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest text-right">Trạng thái</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="p-32 text-center"><Loader2 className="animate-spin text-red-600 mx-auto" size={40} /></td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan={5} className="p-32 text-center text-zinc-600 font-black uppercase text-[10px] tracking-widest">Không có dữ liệu đơn hàng</td></tr>
            ) : filteredData.map((b: any) => (
              <tr key={b.bookingId} className="hover:bg-white/[0.01] transition-all group">
                {/* Cột Mã Đơn & Khách */}
                <td className="p-8">
                  <div className="flex flex-col">
                    <span className="text-red-600 font-mono font-bold text-xs">#{b.bookingId}</span>
                    <span className="font-black uppercase italic text-[11px] mt-1 text-white">{b.user?.firstName} {b.user?.lastName}</span>
                    <span className="text-[9px] text-zinc-600 font-bold">{b.user?.mobileNumber}</span>
                  </div>
                </td>

                {/* Cột Phim */}
                <td className="p-8">
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-10 bg-red-600 rounded-full" />
                    <div>
                      <p className="font-black uppercase italic text-sm tracking-tight">{b.showtime?.movie?.movieName}</p>
                      <div className="flex items-center gap-2 mt-1 text-zinc-500">
                        <Calendar size={10} />
                        <span className="text-[10px] font-bold">{b.showtime?.showDate} | {b.showtime?.startTime?.substring(0,5)}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Cột Chi tiết ghế */}
                <td className="p-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Armchair size={12} className="text-red-600" />
                      <span className="text-xs font-bold uppercase tracking-tighter">
                         Ghế: {b.seats?.map((s: any) => s.seatNumber).join(", ")}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase italic">Phòng: {b.showtime?.room?.roomName}</span>
                  </div>
                </td>

                {/* Cột Giá tiền */}
                <td className="p-8">
                  <div className="flex flex-col">
                    <span className="text-sm font-[1000] text-white italic">{b.totalPrice?.toLocaleString()}đ</span>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase">VNĐ / Thanh toán Online</span>
                  </div>
                </td>

                {/* Cột Trạng thái */}
                <td className="p-8 text-right">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${
                    b.status === 'PAID' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' :
                    b.status === 'PENDING' ? 'bg-amber-500/5 border-amber-500/20 text-amber-500' :
                    'bg-red-500/5 border-red-500/20 text-red-500'
                  }`}>
                    {b.status === 'PAID' ? <CheckCircle2 size={12} /> : 
                     b.status === 'PENDING' ? <Clock size={12} /> : <XCircle size={12} />}
                    <span className="text-[9px] font-[1000] uppercase tracking-widest">
                      {b.status === 'PAID' ? 'Đã thanh toán' : 
                       b.status === 'PENDING' ? 'Chờ thanh toán' : 'Đã hủy'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-between items-center px-8">
         <p className="text-[10px] font-black uppercase text-zinc-700 tracking-widest italic">
           Hiển thị {filteredData.length} kết quả đơn hàng
         </p>
         <div className="flex gap-2">
            <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl opacity-50 cursor-not-allowed"><ChevronRight size={16} className="rotate-180"/></button>
            <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl hover:bg-white hover:text-black transition-all"><ChevronRight size={16}/></button>
         </div>
      </div>
    </div>
  );
}