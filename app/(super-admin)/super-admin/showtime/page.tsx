"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/app/lib/api';
import { 
  Loader2, Calendar, Clock, Film, 
  MapPin, ChevronRight, Monitor, Ticket
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import moment from 'moment';

export default function ShowtimePage() {
  const router = useRouter();
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/api/v1/showtimes');
        const responseData = await res.json();
        // Lấy đúng mảng data từ JSON bà gửi
        setShowtimes(responseData.data || []);
      } catch (err) {
        toast.error("Lỗi kết nối API rồi bà ơi!");
      } finally {
        setLoading(false);
      }
    };
    fetchShowtimes();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={24} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="border-b border-white/5 pb-8">
          <div className="flex items-center gap-2 text-red-600 font-black text-[8px] uppercase tracking-[0.4em] mb-2">
            <Film size={14} /> Cinema Monitoring
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Tất cả <span className="text-zinc-600">Suất chiếu</span>
          </h1>
        </header>

        {/* ĐỔ HẾT DATA RA ĐÂY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showtimes.length > 0 ? showtimes.map((show) => (
            <div 
              key={show.id}
              onClick={() => router.push(`/super-admin/seat/${show.room?.id}`)}
              className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-7 hover:border-red-600/40 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                 <div className="text-[10px] font-black text-red-600 italic uppercase">ID: {show.id}</div>
                 <div className="px-2 py-1 bg-white/5 rounded text-[7px] font-black text-zinc-500 uppercase tracking-tighter">
                   {show.cinemaItem?.city}
                 </div>
              </div>

              <div className="space-y-5">
                <div className="min-h-[60px]">
                  {/* Dùng .title theo đúng JSON */}
                  <h3 className="text-xl font-black uppercase leading-tight group-hover:text-red-500 transition-colors">
                    {show.movie?.title}
                  </h3>
                  <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1">
                    {show.movie?.genre?.name || "Genre"}
                  </p>
                </div>
                
                <div className="space-y-3 py-4 border-y border-white/5">
                  <div className="flex items-center justify-between">
                     <span className="text-[7px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-1.5">
                       <Clock size={10}/> Giờ diễn
                     </span>
                     <span className="text-[11px] font-black italic">
                       {moment(show.startTime).format('HH:mm')} - {moment(show.endTime).format('HH:mm')}
                     </span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[7px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-1.5">
                       <Monitor size={10}/> Phòng
                     </span>
                     <span className="text-[11px] font-black italic text-red-600 uppercase">
                       {show.room?.name}
                     </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 max-w-[80%]">
                    <MapPin size={10} className="text-zinc-800 shrink-0" />
                    <span className="text-[8px] font-bold text-zinc-600 uppercase truncate">
                      {show.cinemaItem?.name} - {show.cinemaItem?.address}
                    </span>
                  </div>
                  <div className="bg-red-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center border border-dashed border-white/5 rounded-[40px]">
               <Ticket className="mx-auto text-zinc-900 mb-4" size={48} />
               <p className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.5em]">Không có dữ liệu suất chiếu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}