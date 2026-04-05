"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { apiRequest } from '@/app/lib/api';
import { 
  Loader2, ArrowLeft, Armchair, 
  ShieldCheck, Zap, Monitor, 
  TrendingUp, MapPin, Heart
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function SeatContent() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id; 

  const [seats, setSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      if (!roomId) return;
      try {
        setLoading(true);
        const res = await apiRequest(`/api/v1/seats/room/${roomId}`);
        if (!res.ok) throw new Error();

        const responseData = await res.json();
        const rawSeats = responseData.data || [];
        
        const sortedSeats = [...rawSeats].sort((a: any, b: any) => {
          if (a.seatRow < b.seatRow) return -1;
          if (a.seatRow > b.seatRow) return 1;
          return parseInt(a.seatNumber) - parseInt(b.seatNumber);
        });
        
        setSeats(sortedSeats);
      } catch (err) {
        toast.error("Lỗi đồng bộ sơ đồ hoặc quyền truy cập (403)");
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [roomId]);

  // LOGIC TÍNH STATS CHO 3 LOẠI GHẾ
  const totalSeats = seats.length;
  const normalSeats = seats.filter(s => s.seatType?.toUpperCase() === 'NORMAL').length;
  const vipSeats = seats.filter(s => s.seatType?.toUpperCase() === 'VIP').length;
  const sweetboxSeats = seats.filter(s => s.seatType?.toUpperCase() === 'SWEETBOX').length;
  const soldSeats = seats.filter(s => s.status?.toUpperCase() === 'SOLD' || s.status === false).length;
  
  const roomData = seats[0]?.room || {};
  const cinemaData = roomData?.cinemaItem || {};

  const renderSeatGrid = () => {
    const rows: { [key: string]: any[] } = {};
    seats.forEach(seat => {
      const rowName = seat.seatRow;
      if (!rows[rowName]) rows[rowName] = [];
      rows[rowName].push(seat);
    });

    return Object.keys(rows).sort().map((row) => (
      <div key={row} className="flex gap-2 justify-center items-center mb-2.5">
        <div className="w-6 text-[9px] font-black text-zinc-700 uppercase text-center">{row}</div>
        <div className="flex gap-2">
          {rows[row].map((seat: any) => {
            const type = seat.seatType?.toUpperCase();
            const isSold = seat.status?.toUpperCase() === 'SOLD' || seat.status === false;
            
            // Định nghĩa màu sắc theo loại ghế
            let seatStyle = "bg-white/5 border-white/10 text-zinc-500"; // Normal
            if (isSold) {
              seatStyle = "bg-zinc-900 border-transparent opacity-20 cursor-not-allowed";
            } else if (type === 'VIP') {
              seatStyle = "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.1)]";
            } else if (type === 'SWEETBOX') {
              seatStyle = "bg-pink-500/10 border-pink-500/40 text-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.1)]";
            }

            return (
              <div
                key={seat.id}
                title={`${seat.name} - ${type}`}
                className={`w-7 h-7 rounded-md flex flex-col items-center justify-center transition-all border ${seatStyle}`}
              >
                <Armchair size={10} />
                <span className="text-[5px] font-bold mt-0.5">{seat.seatNumber}</span>
              </div>
            );
          })}
        </div>
        <div className="w-6 text-[9px] font-black text-zinc-700 uppercase text-center">{row}</div>
      </div>
    ));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={24} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans relative overflow-hidden">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto relative z-10">
        
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-zinc-600 hover:text-white transition-all mb-8 text-[8px] font-black uppercase tracking-widest"
        >
          <div className="p-1 border border-white/5 rounded-full group-hover:border-red-600/40 transition-colors">
            <ArrowLeft size={10} />
          </div>
          Quay lại danh sách phòng
        </button>

        <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600 font-bold text-[8px] uppercase tracking-widest">
              <ShieldCheck size={14} /> {cinemaData.name || "Hệ thống"}
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              {roomData.name || "Sơ đồ ghế"}
            </h1>
          </div>
          
          <div className="flex gap-6 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="text-[6px] font-black text-zinc-500 uppercase">Thường ({normalSeats})</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-[6px] font-black text-zinc-500 uppercase">VIP ({vipSeats})</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                <span className="text-[6px] font-black text-zinc-500 uppercase">Sweetbox ({sweetboxSeats})</span>
             </div>
          </div>
        </header>

        <div className="w-full mb-12 text-center">
          <div className="w-[80%] h-[2px] bg-red-600/30 mx-auto rounded-full shadow-[0_0_20px_rgba(220,38,38,0.2)]" />
          <p className="text-[6px] font-black tracking-[1em] text-zinc-800 uppercase mt-4">Screen Center</p>
        </div>

        <div className="overflow-x-auto pb-12 custom-scrollbar flex justify-center">
          <div className="min-w-max px-4">
            {renderSeatGrid()}
          </div>
        </div>

        {/* BẢNG STATS CẬP NHẬT CHO 3 LOẠI GHẾ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-8">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden group">
              <Zap size={14} className="text-red-600 mb-2" />
              <p className="text-[7px] text-zinc-500 font-black uppercase mb-1">Tổng quy mô</p>
              <p className="text-lg font-black italic">{totalSeats} Ghế</p>
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                <Monitor size={40} />
              </div>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <TrendingUp size={14} className="text-amber-500 mb-2" />
              <p className="text-[7px] text-zinc-500 font-black uppercase mb-1">Hạng cao cấp (VIP)</p>
              <p className="text-lg font-black italic">{vipSeats}</p>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <Heart size={14} className="text-pink-500 mb-2" />
              <p className="text-[7px] text-zinc-500 font-black uppercase mb-1">Hạng Sweetbox</p>
              <p className="text-lg font-black italic">{sweetboxSeats}</p>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <MapPin size={14} className="text-zinc-400 mb-2" />
              <p className="text-[7px] text-zinc-500 font-black uppercase mb-1">Tỷ lệ lấp đầy</p>
              <p className="text-lg font-black italic">{totalSeats > 0 ? Math.round((soldSeats/totalSeats)*100) : 0}%</p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminSeatPage() {
  return (
    <Suspense fallback={null}>
      <SeatContent />
    </Suspense>
  );
}