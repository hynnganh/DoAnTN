"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  CreditCard,
  Wallet,
  CalendarDays
} from "lucide-react";

export default function StatisticsPage() {
  const [dateRange, setDateRange] = useState("month");
  const [loading, setLoading] = useState(false);

  // Giả lập load lại data khi đổi filter
  const handleFilterChange = (range: string) => {
    setLoading(true);
    setDateRange(range);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-10">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-[1000] uppercase tracking-tighter italic">
            Phân Tích <span className="text-red-600">Chuyên Sâu</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
            Báo cáo chi tiết dựa trên dữ liệu đơn hàng
          </p>
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

      {/* BIG CHART AREA (Placeholder for Recharts/Chart.js) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-zinc-900/30 border border-white/5 rounded-[40px] p-8 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest">Biểu đồ doanh thu</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">Biến động theo thời gian</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase transition-all">
              <Download size={14} /> Xuất PDF
            </button>
          </div>

          {/* MÔ PHỎNG BIỂU ĐỒ BẰNG CSS */}
          <div className="h-[300px] w-full flex items-end gap-3 px-4 relative">
             {/* Các cột giả lập */}
             {[40, 70, 45, 90, 65, 80, 50, 85, 100, 75, 60, 95].map((h, i) => (
               <div key={i} className="flex-1 group/bar relative">
                  <div 
                    style={{ height: `${h}%` }} 
                    className="w-full bg-gradient-to-t from-red-900/40 to-red-600 rounded-t-lg transition-all duration-1000 group-hover/bar:to-red-400 group-hover/bar:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                  ></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-all">
                    {h}tr
                  </div>
               </div>
             ))}
          </div>
          <div className="flex justify-between mt-4 px-4 text-[9px] font-black text-zinc-600 uppercase">
             <span>Đầu kỳ</span>
             <span>Cuối kỳ</span>
          </div>
        </div>

        {/* PHÂN TÍCH PHƯƠNG THỨC THANH TOÁN */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-[40px] p-8">
           <h2 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
             <CreditCard size={18} className="text-red-600" />
             Kênh thanh toán
           </h2>
           <div className="space-y-6">
              <PaymentMethodItem 
                icon={<Wallet className="text-blue-500" />} 
                name="Chuyển khoản (VNPay)" 
                amount="85.400.000đ" 
                percent={65} 
              />
              <PaymentMethodItem 
                icon={<CreditCard className="text-emerald-500" />} 
                name="Thẻ nội đạo (ATM)" 
                amount="22.150.000đ" 
                percent={20} 
              />
              <PaymentMethodItem 
                icon={<CalendarDays className="text-orange-500" />} 
                name="Tiền mặt tại quầy" 
                amount="15.000.000đ" 
                percent={15} 
              />
           </div>

           <div className="mt-12 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <p className="text-[10px] font-black text-zinc-500 uppercase mb-4">Nhận xét hệ thống</p>
              <div className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></div>
                 <p className="text-[11px] leading-relaxed text-zinc-400 italic">
                   Doanh thu tháng này <span className="text-emerald-500 font-bold">tăng 15%</span> so với tháng trước. Người dùng có xu hướng thanh toán qua VNPay nhiều hơn.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* CHI TIẾT SÂU HƠN: LỖI & HỦY ĐƠN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <SmallStat label="Tỷ lệ hủy đơn" value="3.2%" status="down" sub="Giảm 1.1% so với kỳ trước" />
         <SmallStat label="Giá trị TB/Đơn" value="452k" status="up" sub="Tăng 12k so với kỳ trước" />
         <SmallStat label="Đơn hoàn tiền" value="12" status="up" sub="Có 3 đơn đang xử lý" />
         <SmallStat label="Khách quay lại" value="48%" status="up" sub="Chỉ số cực tốt" />
      </div>
    </div>
  );
}

// --- Sub-components ---

function PaymentMethodItem({ icon, name, amount, percent }: any) {
  return (
    <div className="group cursor-default">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-950 rounded-lg border border-white/5">{icon}</div>
          <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white transition-all uppercase">{name}</span>
        </div>
        <span className="text-[11px] font-black italic">{amount}</span>
      </div>
      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function SmallStat({ label, value, status, sub }: any) {
  return (
    <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-[30px] hover:bg-white/[0.02] transition-all">
       <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
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