"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, MapPin, Loader2, ChevronRight, Calendar, Film, Clock, Ticket } from 'lucide-react';
import BookingModal from './components/BookingModal';

// 1. SUB-COMPONENT: RENDER TỪNG BỘ PHIM VÀ SUẤT CHIẾU
const MovieShowtimeItem = ({ movie, onSelect }: any) => (
  <div className="flex flex-col md:flex-row gap-5 p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
    <div className="relative shrink-0">
      <div className="w-20 h-28 md:w-24 md:h-36 rounded-2xl overflow-hidden bg-zinc-800 shadow-2xl">
        <img 
          src={movie.image || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=200"} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          alt={movie.title} 
        />
      </div>
      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-red-600 text-[8px] font-[1000] text-white uppercase shadow-lg">
        {movie.tag || "T18"}
      </span>
    </div>

    <div className="flex-1 space-y-4">
      <div>
        <h4 className="text-base md:text-lg font-[1000] italic uppercase tracking-tighter text-white group-hover:text-red-500 transition-colors">
          {movie.title}
        </h4>
        <div className="flex items-center gap-3 mt-1">
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} /> {movie.duration || "120"} PHÚT
            </p>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">PHỤ ĐỀ TIẾNG VIỆT</p>
        </div>
      </div>

      <div className="space-y-4">
        {movie.formats?.map((f: any, i: number) => (
          <div key={i} className="space-y-2">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-1.5">
              <Ticket size={10} className="text-red-600" /> {f.type}
            </span>
            <div className="flex flex-wrap gap-2">
              {f.times.map((t: string) => (
                <button 
                  key={t} 
                  onClick={() => onSelect(movie, t, f.type)} 
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 text-[10px] font-black hover:bg-red-600 hover:border-red-600 hover:shadow-[0_5px_15px_rgba(220,38,38,0.3)] transition-all active:scale-95"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function Cinema() {
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchingShowtimes, setFetchingShowtimes] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  const dateRef = useRef<HTMLDivElement>(null);

  // FETCH DANH SÁCH RẠP (GET /api/v1/cinemas)
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/cinemas');
        if (!res.ok) throw new Error("Status " + res.status);
        const data = await res.json();
        setCinemas(data.data || []);
        if (data.data?.length > 0) setSelectedId(data.data[0].id);
      } catch (error) {
        console.error("Lỗi tải danh sách rạp:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCinemas();
  }, []);

  // FETCH SUẤT CHIẾU - ĐÃ FIX KHỚP VỚI BE: /api/v1/showtimes/cinema-item/{id}
  useEffect(() => {
    if (!selectedId) return;

    const fetchShowtimes = async () => {
      setFetchingShowtimes(true);
      try {
        const res = await fetch(`http://localhost:8080/api/v1/showtimes/cinema-item/${selectedId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
            console.error(`Lỗi ${res.status}: Check lại endpoint /api/v1/showtimes/cinema-item/${selectedId}`);
            setMovies([]);
            return;
        }

        const result = await res.json();
        
        if (result && result.data) {
          // 1. FILTER THEO NGÀY Ở FRONTEND (Vì cổng này của BE chưa lọc theo ngày)
          const filteredByDate = result.data.filter((item: any) => 
            item.startTime.startsWith(selectedDate)
          );

          // 2. GROUPING DỮ LIỆU
          const grouped = filteredByDate.reduce((acc: any, curr: any) => {
            const m = curr.movie;
            if (!m) return acc;

            if (!acc[m.id]) {
              acc[m.id] = { 
                id: m.id, 
                title: m.title, 
                image: m.imageUrl, 
                tag: m.ageTag, 
                duration: m.duration,
                formats: {} 
              };
            }
            
            const roomType = curr.room?.type || "2D PHỤ ĐỀ";
            if (!acc[m.id].formats[roomType]) acc[m.id].formats[roomType] = [];
            
            const timeStr = new Date(curr.startTime).toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: false 
            });
            
            acc[m.id].formats[roomType].push(timeStr);
            return acc;
          }, {});

          setMovies(Object.values(grouped).map((m: any) => ({
            ...m,
            formats: Object.entries(m.formats).map(([type, times]) => ({ type, times }))
          })));
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
        setMovies([]);
      } finally {
        setFetchingShowtimes(false);
      }
    };

    fetchShowtimes();
  }, [selectedId, selectedDate]); // Trigger lại khi đổi ngày hoặc đổi rạp

  const filteredCinemas = useMemo(() => 
    cinemas.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())), 
  [cinemas, searchTerm]);

  const dateTabs = useMemo(() => {
    return [...Array(10)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        id: d.toISOString().split('T')[0],
        dayName: i === 0 ? "Hôm nay" : d.toLocaleDateString('vi-VN', { weekday: 'short' }),
        dateNum: d.getDate(),
      };
    });
  }, []);

  if (loading) return (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center gap-2">
      <Loader2 className="animate-spin text-red-600" size={30} />
      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600">Đang khởi tạo...</span>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen pt-16 pb-12 px-4 md:px-6 text-white selection:bg-red-600">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HERO HEADER */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900/40 border border-white/5 p-8">
          <div className="relative z-10 flex items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full">
                <div className="w-1 h-1 bg-red-600 rounded-full animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-red-500">Hệ thống rạp A&K</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-[1000] italic uppercase tracking-tighter leading-none text-white">
                Đặt Vé <br /><span className="text-red-600">Nhanh Chóng</span>
              </h1>
            </div>
            <div className="p-5 bg-zinc-900 rounded-[2rem] border border-white/5 hidden md:block">
               <Film size={40} className="text-red-600 opacity-80" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <aside className="lg:col-span-4 space-y-4">
            <div className="relative group">
              <input 
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm rạp..." 
                className="w-full bg-zinc-900/50 border border-white/5 py-4 pl-12 pr-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider outline-none focus:border-red-600/50 transition-all backdrop-blur-xl"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors" size={14} />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredCinemas.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex justify-between items-center ${selectedId === c.id ? 'bg-red-600 border-red-600 shadow-xl scale-[0.98]' : 'bg-zinc-900/30 border-white/5 hover:border-white/10'}`}
                >
                  <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${selectedId === c.id ? 'bg-red-700 border-white/10' : 'bg-black border-white/5'}`}>
                        <MapPin size={16} className={`${selectedId === c.id ? 'text-white' : 'text-red-600'}`} />
                     </div>
                     <h3 className={`text-sm font-[1000] italic uppercase tracking-tighter ${selectedId === c.id ? 'text-white' : 'text-zinc-300'}`}>{c.name}</h3>
                  </div>
                  <ChevronRight size={18} className={`${selectedId === c.id ? 'text-white' : 'text-zinc-700'}`} />
                </div>
              ))}
            </div>
          </aside>

          <main className="lg:col-span-8 space-y-6">
            <div className="relative">
              <div ref={dateRef} className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x cursor-grab active:cursor-grabbing">
                {dateTabs.map(d => (
                  <button 
                    key={d.id} onClick={() => setSelectedDate(d.id)}
                    className={`snap-start min-w-[80px] flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 ${selectedDate === d.id ? 'bg-white text-black border-white shadow-2xl scale-105' : 'bg-zinc-900/40 border-white/5 text-zinc-500 hover:border-white/20'}`}
                  >
                    <span className="text-[8px] font-black uppercase tracking-widest mb-1.5">{d.dayName}</span>
                    <span className="text-2xl font-[1000] italic tracking-tighter leading-none">{d.dateNum}</span>
                  </button>
                ))}
              </div>
            </div>

            <section className="relative rounded-[2.5rem] bg-zinc-900/20 border border-white/5 p-6 md:p-8 backdrop-blur-3xl min-h-[400px]">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-[1000] italic uppercase text-white tracking-tighter leading-none">
                      {cinemas.find(c => c.id === selectedId)?.name || "Lịch Chiếu"}
                    </h2>
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 mt-1.5 italic">Official Showtimes</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {fetchingShowtimes ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <Loader2 size={32} className="animate-spin mb-4" />
                    <p className="text-[9px] font-black uppercase tracking-widest">Đang tải suất chiếu...</p>
                  </div>
                ) : movies.length > 0 ? (
                  movies.map((m, idx) => (
                    <MovieShowtimeItem 
                      key={m.id || idx} 
                      movie={m} 
                      onSelect={(movie: any, time: any, format: any) => setBooking({ ...movie, time, format })} 
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                    <Film size={40} className="mb-4 text-zinc-800" />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em]">Không có suất chiếu cho ngày này</p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {booking && <BookingModal info={booking} onClose={() => setBooking(null)} />}
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
      `}</style>
    </div>
  );
}