"use client";
import { useState, useEffect } from "react";
import { 
  BarChart3, Calendar, Download, Filter, 
  ArrowUpRight, ArrowDownRight, TrendingUp,
  CreditCard, Wallet, CalendarDays, Building2,
  Trophy, Star, Activity
} from "lucide-react";

export default function StatisticsPage() {
  const [dateRange, setDateRange] = useState("month");
  const [loading, setLoading] = useState(false);

  // Dữ liệu giả lập doanh thu theo từng rạp
  const cinemaRevenueData = [
    { name: "A&K Thủ Đức", revenue: 125, grow: 12, color: "bg-red-600" },
    { name: "A&K Quận 9", revenue: 98, grow: -5, color: "bg-orange-500" },
    { name: "A&K Bình Thạnh", revenue: 156, grow: 20, color: "bg-emerald-500" },
    { name: "A&K Gò Vấp", revenue: 74, grow: 8, color: "bg-blue-500" },
    { name: "A&K Tân Bình", revenue: 112, grow: 15, color: "bg-purple-500" },
  ];

  const handleFilterChange = (range: string) => {
    setLoading(true);
    setDateRange(range);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-10 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-black text-[8px] uppercase tracking-[0.4em] mb-2">
            <Activity size={14} /> Analytics Dashboard
          </div>
          <h1 className="text-4xl font-[1000] uppercase tracking-tighter italic">
            Doanh Thu <span className="text-zinc-600">Hệ Thống</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
          {['day', 'week', 'month', 'year'].map((item) => (
            <button
              key={item}
              onClick={() => handleFilterChange(item)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                dateRange === item 
                ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
                : "text-zinc-500 hover:text-white"
              }`}
            >
              {item === 'day' ? 'Hôm nay' : item === 'week' ? 'Tuần' : item === 'month' ? 'Tháng' : 'Năm'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* BIỂU ĐỒ SO SÁNH DOANH THU CÁC RẠP */}
        <div className="lg:col-span-2 bg-zinc-900/30 border border-white/5 rounded-[40px] p-8 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
                <BarChart3 size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest">Hiệu năng rạp</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">So sánh doanh thu (Triệu VNĐ)</p>
              </div>
            </div>
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase transition-all">
              <Download size={14} /> Tải báo cáo
            </button>
          </div>

          <div className="h-[350px] w-full flex items-end gap-6 md:gap-12 px-4 relative">
             {cinemaRevenueData.map((data, i) => (
               <div key={i} className="flex-1 group/bar relative flex flex-col items-center">
                  <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-all duration-300">
                    <span className="bg-white text-black text-[10px] font-[1000] px-2 py-1 rounded-lg">
                      {data.revenue}M
                    </span>
                  </div>
                  
                  <div 
                    style={{ height: `${(data.revenue / 160) * 100}%` }} 
                    className={`w-full max-w-[40px] ${data.color} rounded-t-2xl transition-all duration-1000 group-hover/bar:brightness-125 group-hover/bar:shadow-[0_0_30px_rgba(220,38,38,0.3)] relative`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl"></div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-[9px] font-black uppercase text-zinc-500 group-hover/bar:text-white transition-colors rotate-45 md:rotate-0 origin-left">
                      {data.name.replace("A&K ", "")}
                    </p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* TOP CINEMA RANKING */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-[40px] p-8 flex flex-col">
           <h2 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
             <Trophy size={18} className="text-yellow-500" />
             Bảng xếp hạng
           </h2>
           
           <div className="space-y-5 flex-1">
              {cinemaRevenueData.sort((a, b) => b.revenue - a.revenue).map((cinema, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-4">
                    <span className={`text-xl font-black italic ${index === 0 ? 'text-yellow-500' : 'text-zinc-700'}`}>
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-[10px] font-black uppercase">{cinema.name}</p>
                      <p className={`text-[8px] font-bold uppercase ${cinema.grow > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {cinema.grow > 0 ? `+${cinema.grow}%` : `${cinema.grow}%`} so với kỳ trước
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black italic">{cinema.revenue}.0M</p>
                  </div>
                </div>
              ))}
           </div>

           <div className="mt-8 p-6 bg-red-600/10 border border-red-600/20 rounded-3xl">
              <div className="flex items-center gap-3 mb-2">
                <Star size={14} className="text-red-600 fill-red-600" />
                <p className="text-[10px] font-black text-red-600 uppercase">Insight</p>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400 italic">
                Rạp <span className="text-white font-bold">A&K Bình Thạnh</span> đang dẫn đầu doanh thu nhờ lượng khách xem phim "Lật Mặt 7" tăng đột biến.
              </p>
           </div>
        </div>
      </div>

      {/* FOOTER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <SmallStat label="Tổng doanh thu" value="565.0M" status="up" sub="Vượt chỉ tiêu 5%" />
         <SmallStat label="Tổng đơn hàng" value="1.248" status="up" sub="Tăng 120 đơn" />
         <SmallStat label="Tỷ lệ lấp đầy" value="68%" status="down" sub="Giảm nhẹ buổi sáng" />
         <SmallStat label="Khách hàng mới" value="+452" status="up" sub="Chỉ số tăng trưởng tốt" />
      </div>
    </div>
  );
}

// --- Sub-components ---

function SmallStat({ label, value, status, sub }: any) {
  return (
    <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-[30px] hover:border-red-600/30 transition-all group">
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-red-600 transition-colors">{label}</p>
        <div className="flex items-baseline gap-2 mb-2">
           <h4 className="text-2xl font-black italic">{value}</h4>
           <span className={`text-[9px] font-bold ${status === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
             {status === 'up' ? '↑' : '↓'}
           </span>
        </div>
        <p className="text-[9px] text-zinc-600 font-bold italic">{sub}</p>
    </div>
  );
}