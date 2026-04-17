"use client";
import React, { useState, useEffect, use } from 'react';
import { Calendar, MapPin, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Import các hàm tiện ích từ lib
import { apiRequest, getImageUrl } from "../../../../lib/api"; 

export default function MovieBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = resolvedParams.id;
  const router = useRouter();

  // State quản lý dữ liệu
  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Khởi tạo ngày mặc định là hôm nay
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchMovieDetail();
  }, [movieId]);

  // Gọi lại danh sách suất chiếu khi đổi ngày
  useEffect(() => {
    if (selectedDate) fetchShowtimes();
  }, [selectedDate, movieId]);

  const fetchMovieDetail = async () => {
    try {
      const res = await apiRequest(`/api/v1/movies/${movieId}`);
      const resData = await res.json();
      if (res.ok) setMovie(resData.data);
    } catch (error) {
      console.error("Lỗi lấy thông tin phim:", error);
    }
  };

  const fetchShowtimes = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/api/v1/showtimes/movie/${movieId}?date=${selectedDate}`);
      if (!res.ok) {
        setShowtimes([]);
        return;
      }
      const resData = await res.json();
      setShowtimes(resData.data || []);
    } catch (error) {
      console.error("Lỗi lấy suất chiếu:", error);
      setShowtimes([]);
    } finally {
      setLoading(false);
    }
  };

  // Gom nhóm suất chiếu theo tên rạp
  const groupedShowtimes = showtimes.reduce((acc: any, st: any) => {
    const cinemaName = st.cinemaItem?.name || st.room?.cinemaItem?.name || "Rạp A&K Cinema"; 
    if (!acc[cinemaName]) acc[cinemaName] = [];
    acc[cinemaName].push(st);
    return acc;
  }, {});

  // Tạo danh sách 7 ngày tới để chọn
  const getDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const fullDate = date.toISOString().split('T')[0];
      days.push({
        fullDate,
        displayDate: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        dayName: i === 0 ? "HÔM NAY" : date.toLocaleDateString('vi-VN', { weekday: 'short' }).toUpperCase()
      });
    }
    return days;
  };

  const formatTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return "00:00";
    const parts = dateTimeStr.split('T');
    return parts[1] ? parts[1].substring(0, 5) : "00:00";
  };

  const moviePosterUrl = movie?.posterUrl ? getImageUrl(movie.posterUrl) : null;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-10 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Nút quay lại */}
        <Link href={`/movies/${movieId}`} className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Quay lại thông tin phim
        </Link>

        <header className="space-y-4">
          <h1 className="text-xl md:text-3xl font-[1000] italic uppercase tracking-tighter leading-none">
            Lịch chiếu: <span className="text-red-600">{movie?.title}</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* CỘT TRÁI: CHỌN NGÀY VÀ SUẤT CHIẾU */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* 01. Chọn ngày */}
            <section className="space-y-6">
              <h3 className="flex items-center gap-3 text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">
                <Calendar size={16} className="text-red-600" /> 01. Chọn ngày xem
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {getDays().map((day) => (
                  <button 
                    key={day.fullDate} 
                    onClick={() => setSelectedDate(day.fullDate)}
                    className={`px-8 py-5 rounded-[2rem] border font-black text-[11px] transition-all shrink-0 ${
                      selectedDate === day.fullDate 
                        ? 'bg-red-600 border-red-600 shadow-xl scale-105 text-white' 
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/30'
                    }`}
                  >
                    <div className="text-[9px] opacity-70 mb-1">{day.dayName}</div>
                    {day.displayDate}
                  </button>
                ))}
              </div>
            </section>

            {/* 02. Chọn rạp và giờ */}
            <section className="space-y-8">
              <h3 className="flex items-center gap-3 text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">
                <MapPin size={16} className="text-red-600" /> 02. Cụm rạp & Suất chiếu
              </h3>

              {loading ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-red-600" /></div>
              ) : Object.keys(groupedShowtimes).length > 0 ? (
                Object.entries(groupedShowtimes).map(([cinemaName, times]: any) => (
                  <div key={cinemaName} className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-8 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <h4 className="text-xl md:text-xl font-[1000] italic uppercase tracking-tight text-white">{cinemaName}</h4>
                    <div className="flex flex-wrap gap-4">
                      {times.map((st: any) => (
                        <button 
                          key={st.id}
                          onClick={() => {
                            // CHUYỂN HƯỚNG SANG TRANG CHỌN GHẾ
                            router.push(`/booking/${st.id}`);
                          }}
                          className="px-8 py-4 bg-zinc-900/60 border border-white/5 rounded-2xl text-xs font-black hover:bg-white hover:text-black transition-all uppercase italic tracking-[0.2em] active:scale-95"
                        >
                          {formatTime(st.startTime)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                    Không có suất chiếu cho ngày {selectedDate}
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* CỘT PHẢI: POSTER PHIM (Sticky) */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 bg-zinc-900/20 border border-white/5 rounded-[3rem] p-10 space-y-8 text-center">
              <div className="aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900">
                {moviePosterUrl ? (
                  <img 
                    src={moviePosterUrl} 
                    className="w-full h-full object-cover" 
                    alt="poster" 
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/400x600?text=No+Poster";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs font-bold uppercase tracking-widest">
                    No Poster
                  </div>
                )}
              </div>
              <h5 className="text-xl font-black uppercase italic tracking-tighter leading-tight">{movie?.title}</h5>
              <div className="pt-4 border-t border-white/5">
                 <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">Đang chọn ngày</p>
                 <p className="text-red-600 font-black italic">{selectedDate}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}