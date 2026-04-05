"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiRequest } from '@/app/lib/api';
import { 
  Loader2, Calendar, Clock, Film, 
  MapPin, ChevronLeft, Monitor, Ticket,
  Star, Globe, User, Layers, Info
} from 'lucide-react';
import moment from 'moment';

export default function ShowtimeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [showtime, setShowtime] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await apiRequest(`/api/v1/showtimes/${id}`);
        const responseData = await res.json();
        setShowtime(responseData.data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={32} />
    </div>
  );

  if (!showtime) return <div className="text-white text-center py-20">Không tìm thấy suất chiếu!</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-2 font-sans">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        
        {/* Nút quay lại */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Quay lại
        </button>

        {/* Header Chi tiết */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Poster phim */}
          <div className="w-full lg:w-1/3 shrink-0">
            <div className="aspect-[2/3] rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2xl">
              <img 
                src={showtime.movie?.posterUrl || "/placeholder-movie.jpg"} 
                alt={showtime.movie?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                 <span className="px-3 py-1 bg-red-600 rounded-full text-[8px] font-black uppercase italic">
                    {showtime.movie?.status || "Now Showing"}
                 </span>
              </div>
            </div>
          </div>

          {/* Thông tin chính */}
          <div className="flex-1 space-y-8">
            <div className="space-y-2">
              <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                {showtime.movie?.title}
              </h1>
              <p className="text-zinc-500 text-sm italic font-medium leading-relaxed max-w-2xl">
                {showtime.movie?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem icon={<Clock size={14}/>} label="Thời lượng" value={`${showtime.movie?.duration} Phút`} />
              <InfoItem icon={<Star size={14}/>} label="Đánh giá" value={`${showtime.movie?.rating}/5`} />
              <InfoItem icon={<Globe size={14}/>} label="Quốc gia" value={showtime.movie?.country || "N/A"} />
              <InfoItem icon={<Layers size={14}/>} label="Thể loại" value={showtime.movie?.genre?.name} />
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 italic">Lịch chiếu & Địa điểm</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl"><Calendar size={18} className="text-zinc-400"/></div>
                    <div>
                      <p className="text-[8px] font-black text-zinc-600 uppercase">Ngày chiếu</p>
                      <p className="text-lg font-black italic">{moment(showtime.startTime).format('DD [Tháng] MM, YYYY')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl"><Clock size={18} className="text-zinc-400"/></div>
                    <div>
                      <p className="text-[8px] font-black text-zinc-600 uppercase">Khung giờ</p>
                      <p className="text-lg font-black italic text-red-600">
                        {moment(showtime.startTime).format('HH:mm')} — {moment(showtime.endTime).format('HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl"><Monitor size={18} className="text-zinc-400"/></div>
                    <div>
                      <p className="text-[8px] font-black text-zinc-600 uppercase">Phòng chiếu</p>
                      <p className="text-lg font-black italic">{showtime.room?.name} ({showtime.room?.totalSeats} Ghế)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl"><MapPin size={18} className="text-zinc-400"/></div>
                    <div>
                      <p className="text-[8px] font-black text-zinc-600 uppercase">Cụm rạp</p>
                      <p className="text-lg font-black italic truncate">{showtime.cinemaItem?.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nút đi tới quản lý ghế */}
              <button 
                onClick={() => router.push(`/super-admin/seat/${showtime.room?.id}`)}
                className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(220,38,38,0.2)]"
              >
                <Ticket size={20} /> Quản lý sơ đồ ghế
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[10px]">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                <span className="text-zinc-600 font-black uppercase block mb-2 tracking-widest flex items-center gap-2">
                  <User size={12}/> Đạo diễn
                </span>
                <span className="font-bold">{showtime.movie?.director}</span>
              </div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                <span className="text-zinc-600 font-black uppercase block mb-2 tracking-widest flex items-center gap-2">
                   Diễn viên
                </span>
                <span className="font-bold">{showtime.movie?.cast}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component phụ cho gọn
function InfoItem({ icon, label, value }: { icon: any, label: string, value: any }) {
  return (
    <div className="bg-white/[0.03] p-4 rounded-3xl border border-white/5">
      <div className="text-zinc-600 mb-1">{icon}</div>
      <p className="text-[7px] font-black text-zinc-600 uppercase tracking-tighter">{label}</p>
      <p className="text-[11px] font-black italic uppercase truncate">{value || "N/A"}</p>
    </div>
  );
}