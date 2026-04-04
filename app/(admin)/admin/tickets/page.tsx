"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Ticket, Calendar, Armchair, 
  Loader2, RefreshCw, CheckCircle2, 
  Clock, XCircle, ChevronRight, MapPin
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { apiRequest } from '@/app/lib/api'; // Tái sử dụng api.ts của bà

export default function QuanLyDonHangPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // 1. Lấy dữ liệu từ endpoint mới: /api/v1/tickets/my-history
  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Sử dụng apiRequest để tự động đính kèm Token và xử lý 403
      const res = await apiRequest('/api/v1/tickets/my-history');
      const result = await res.json();
      
      if (res.ok) {
        // API này thường trả về List<Ticket> hoặc Object chứa data: List<Ticket>
        setBookings(result.data || result || []);
      } else {
        toast.error("Không thể lấy lịch sử đặt vé!");
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // 2. Logic lọc dữ liệu linh hoạt
  const filteredData = bookings.filter(b => {
    const movieName = b.showtime?.movie?.movieName || "";
    const bookingId = b.bookingId?.toString() || "";
    
    const matchesSearch = 
      bookingId.includes(searchTerm) || 
      movieName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "ALL" || b.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-3 font-sans selection:bg-red-600/30">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-zinc-900 rounded-3xl border border-white/5 shadow-xl text-red-600">
            <Ticket size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter leading-none">
              LỊCH SỬ <span className="text-red-600">ĐẶT VÉ</span>
            </h1>
            <p className="text-zinc-500 font-black uppercase text-[9px] tracking-[0.4em] mt-2 italic">Kiểm tra các suất chiếu đã đặt của bà</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input 
              type="text" 
              placeholder="Tìm mã đơn hoặc tên phim..." 
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-800"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-zinc-900 border border-white/5 rounded-2xl py-4 px-4 text-[10px] font-black uppercase outline-none cursor-pointer text-zinc-400"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Tất cả</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
          <button onClick={fetchBookings} className="p-4 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-white hover:text-black transition-all group">
            <RefreshCw size={18} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
          </button>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-zinc-900/30 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Mã Vé</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Phim & Địa điểm</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Suất chiếu</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Ghế ngồi</th>
                <th className="p-8 text-[10px] font-black uppercase text-zinc-600 tracking-widest text-right">Trạng thái</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="p-32 text-center"><Loader2 className="animate-spin text-red-600 mx-auto" size={40} /></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="p-32 text-center text-zinc-700 font-black uppercase text-[10px] tracking-widest">Bà chưa có giao dịch nào</td></tr>
              ) : filteredData.map((b: any) => (
                <tr key={b.bookingId} className="hover:bg-white/[0.01] transition-all group">
                  <td className="p-8">
                    <span className="text-red-600 font-mono font-bold text-xs">#{b.bookingId}</span>
                    <p className="text-[9px] text-zinc-600 font-bold mt-1 uppercase italic">Giao dịch online</p>
                  </td>

                  <td className="p-8">
                    <div className="flex flex-col">
                      <p className="font-black uppercase italic text-sm tracking-tight group-hover:text-red-500 transition-colors">{b.showtime?.movie?.movieName}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-zinc-500">
                        <MapPin size={10} className="text-red-600" />
                        <span className="text-[9px] font-black uppercase tracking-tighter italic">
                          {b.showtime?.room?.cinemaItem?.name || "Chi nhánh Cinema"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-8">
                    <div className="flex items-center gap-3 text-zinc-300">
                      <Calendar size={14} className="text-zinc-700" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black italic">{b.showtime?.showDate}</span>
                        <span className="text-[10px] font-bold text-red-600">{b.showtime?.startTime?.substring(0,5)}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500"><Armchair size={14} /></div>
                      <div>
                        <p className="text-xs font-black italic uppercase">
                          {b.seats?.map((s: any) => s.seatNumber).join(", ")}
                        </p>
                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter italic">
                          {b.showtime?.room?.roomName} • {b.totalPrice?.toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-8 text-right">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${
                      b.status === 'PAID' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' :
                      b.status === 'PENDING' ? 'bg-amber-500/5 border-amber-500/20 text-amber-500' :
                      'bg-red-500/5 border-red-500/20 text-red-500'
                    }`}>
                      {b.status === 'PAID' ? <CheckCircle2 size={10} /> : 
                       b.status === 'PENDING' ? <Clock size={10} /> : <XCircle size={10} />}
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {b.status === 'PAID' ? 'Hoàn tất' : 
                         b.status === 'PENDING' ? 'Đang chờ' : 'Đã hủy'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center px-8">
          <p className="text-[9px] font-black uppercase text-zinc-800 tracking-widest italic">
            Tổng cộng: {filteredData.length} vé đã đặt
          </p>
          <div className="flex gap-2">
             <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl opacity-30 cursor-not-allowed"><ChevronRight size={14} className="rotate-180"/></button>
             <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl hover:bg-white hover:text-black transition-all shadow-lg active:scale-95"><ChevronRight size={14}/></button>
          </div>
      </div>
    </div>
  );
}