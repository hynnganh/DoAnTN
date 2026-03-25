"use client";
import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Globe, Zap, Users, Film, Ticket } from 'lucide-react';

export default function SuperDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTickets: 0,
    activeMovies: 0,
    occupancyRate: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateDashboard = async () => {
      const token = localStorage.getItem('token');
      try {
        // 1. Fetch dữ liệu thô từ các API bà đã có
        const [resUsers, resCinemas, resTickets, resMovies] = await Promise.all([
          fetch('http://localhost:8080/api/v1/users', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:8080/api/v1/cinemas', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:8080/api/v1/tickets', { headers: { 'Authorization': `Bearer ${token}` } }), // Giả định bà có API lấy list vé
          fetch('http://localhost:8080/api/v1/movies', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const [users, cinemas, tickets, movies] = await Promise.all([
          resUsers.json(), resCinemas.json(), resTickets.json(), resMovies.json()
        ]);

        // 2. CỘNG TRỪ NHÂN CHIA TẠI ĐÂY
        
        // Tính tổng doanh thu (Cộng dồn price của tất cả vé)
        const totalRev = tickets.data.reduce((sum: number, t: any) => sum + t.price, 0);
        
        // Tính tổng vé đã bán
        const totalTix = tickets.data.length;

        // Tính tỷ lệ lấp đầy (Giả định: số vé bán / (tổng số ghế * số suất chiếu))
        // Đây là công thức nhân chia tận dụng dữ liệu:
        const totalSeatsAvailable = 10000; // Con số giả định tổng ghế hệ thống
        const occRate = ((totalTix / totalSeatsAvailable) * 100).toFixed(1);

        setStats({
          totalRevenue: totalRev / 1000000000, // Đổi sang đơn vị Tỷ VNĐ
          totalTickets: totalTix,
          activeMovies: movies.data.length,
          occupancyRate: Number(occRate),
          totalUsers: users.data.length
        });

      } catch (error) {
        console.error("Lỗi tính toán dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    calculateDashboard();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse text-zinc-500 uppercase font-black text-xs tracking-[0.5em]">Đang tính toán dữ liệu...</div>;

  return (
    <div className="space-y-10 pt-4 animate-in fade-in duration-1000 pb-20">
      
      {/* 1. Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-[1000] italic tracking-tighter uppercase text-white leading-none">
            Hệ thống <span className="text-red-600">Cinema</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mt-4 italic">
            Dữ liệu tổng hợp từ {stats.totalTickets} giao dịch
          </p>
        </div>
      </div>

      {/* 2. Doanh thu chính (Dữ liệu đã qua tính toán) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-12 bg-zinc-950 border border-white/5 rounded-[4rem] relative overflow-hidden group shadow-2xl">
          <div className="relative z-10 space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full">
              <Zap size={14} className="text-red-600 fill-red-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Tổng doanh thu thực tế</span>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-7xl font-[1000] italic tracking-tighter uppercase leading-none text-white">
                {stats.totalRevenue.toFixed(2)} <span className="text-3xl text-zinc-600">Tỷ VNĐ</span>
              </h2>
              <div className="flex items-center gap-2 text-emerald-400 font-black italic text-lg">
                <TrendingUp size={20} />
                <span>Số liệu dựa trên tất cả cụm rạp</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/5">
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-600 mb-1">Tổng vé bán</p>
                <p className="text-2xl font-black italic text-white">{stats.totalTickets.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-600 mb-1">Tỷ lệ lấp đầy</p>
                <p className="text-2xl font-black italic text-white">{stats.occupancyRate}%</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-600 mb-1">Phim khả dụng</p>
                <p className="text-2xl font-black italic text-white">{stats.activeMovies}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cột trạng thái */}
        <div className="bg-red-600 p-10 rounded-[4rem] flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <Activity size={32} strokeWidth={3} className="text-white mb-8" />
          <div className="text-white space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Tổng người dùng</p>
            <h3 className="text-5xl font-[1000] italic uppercase tracking-tighter">{stats.totalUsers.toLocaleString()}</h3>
            <p className="text-[10px] font-bold bg-black/10 p-3 rounded-xl">Hệ thống đang phục vụ lượng lớn khách hàng trực tuyến.</p>
          </div>
        </div>
      </div>

      {/* 3. Phân tích nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
         <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem]">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Trung bình giá vé</p>
            <p className="text-2xl font-black italic mt-2">
                {((stats.totalRevenue * 1000000000) / (stats.totalTickets || 1)).toLocaleString()} VNĐ
            </p>
         </div>
         {/* Thêm các khối tính toán khác tương tự */}
      </div>
    </div>
  );
}