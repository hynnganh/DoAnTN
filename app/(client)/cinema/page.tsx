"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, MapPin, Loader2, ChevronRight, Calendar, Film, Clock, Ticket } from 'lucide-react';
import BookingModal from './components/BookingModal';
import { apiRequest } from '@/app/lib/api';

const MovieShowtimeItem = ({ movie, onSelect }: any) => (
  <div className="flex flex-col md:flex-row gap-5 p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
    <div className="relative shrink-0">
      <div className="w-20 h-28 md:w-24 md:h-36 rounded-2xl overflow-hidden bg-zinc-800 shadow-2xl">
        <img src={movie.image || ""} className="w-full h-full object-cover" alt={movie.title} />
      </div>
      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-red-600 text-[8px] font-black text-white uppercase">{movie.tag || "T18"}</span>
    </div>
    <div className="flex-1 space-y-4">
      <h4 className="text-base md:text-lg font-[1000] italic uppercase tracking-tighter text-white">{movie.title}</h4>
      <div className="space-y-4">
        {movie.formats?.map((f: any, i: number) => (
          <div key={i} className="space-y-2">
            <span className="text-[8px] font-black text-zinc-600 uppercase flex items-center gap-1.5"><Ticket size={10} className="text-red-600" /> {f.type}</span>
            <div className="flex flex-wrap gap-2">
              {f.times.map((st: any) => (
                <button 
                  key={st.id} 
                  onClick={() => onSelect(movie, st, f.type)} 
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 text-[10px] font-black hover:bg-red-600 transition-all active:scale-95"
                >
                  {st.time}
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
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const [cinemas, setCinemas] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchingShowtimes, setFetchingShowtimes] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => { if (isMounted) setSelectedDate(new Date().toISOString().split('T')[0]); }, [isMounted]);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const res = await apiRequest('/api/v1/cinemas');
        const result = await res.json();
        const list = result.data || result;
        setCinemas(list);
        if (list?.length > 0) setSelectedId(list[0].id);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchCinemas();
  }, []);

  useEffect(() => {
    if (!selectedId || !selectedDate) return;
    const fetchShowtimes = async () => {
      setFetchingShowtimes(true);
      try {
        const res = await apiRequest(`/api/v1/showtimes/cinema-item/${selectedId}`);
        const result = await res.json();
        if (result?.data) {
          const filtered = result.data.filter((item: any) => item.startTime.startsWith(selectedDate));
          const grouped = filtered.reduce((acc: any, curr: any) => {
            const m = curr.movie;
            if (!m) return acc;
            if (!acc[m.id]) acc[m.id] = { id: m.id, title: m.title, image: m.imageUrl, tag: m.ageTag, formats: {} };
            const type = curr.room?.type || "2D PHỤ ĐỀ";
            if (!acc[m.id].formats[type]) acc[m.id].formats[type] = [];
            const timeStr = new Date(curr.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
            
            // QUAN TRỌNG: Lưu ID của suất chiếu (curr.id)
            acc[m.id].formats[type].push({ id: curr.id, time: timeStr, roomId: curr.room?.id });
            return acc;
          }, {});
          setMovies(Object.values(grouped).map((m: any) => ({ ...m, formats: Object.entries(m.formats).map(([type, times]) => ({ type, times })) })));
        } else { setMovies([]); }
      } catch (e) { setMovies([]); } finally { setFetchingShowtimes(false); }
    };
    fetchShowtimes();
  }, [selectedId, selectedDate]);

  const dateTabs = useMemo(() => {
    const VI_DAYS = ["CN", "TH 2", "TH 3", "TH 4", "TH 5", "TH 6", "TH 7"];
    return [...Array(10)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() + i);
      return { id: d.toISOString().split('T')[0], dayName: i === 0 ? "Hôm nay" : VI_DAYS[d.getDay()], dateNum: d.getDate() };
    });
  }, []);

  if (!isMounted || loading) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>;

  return (
    <div className="bg-[#050505] min-h-screen pt-16 pb-12 px-4 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 space-y-4">
            <input onChange={e => setSearchTerm(e.target.value)} placeholder="TÌM RẠP..." className="w-full bg-zinc-900/50 border border-white/5 py-4 px-6 rounded-2xl text-[11px] font-bold outline-none" />
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {cinemas.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((c) => (
                <div key={c.id} onClick={() => setSelectedId(c.id)} className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedId === c.id ? 'bg-red-600 border-red-600 shadow-xl' : 'bg-zinc-900/30 border-white/5 hover:border-white/10'}`}>
                   <h3 className="text-sm font-black italic uppercase">{c.name}</h3>
                </div>
              ))}
            </div>
          </aside>

          <main className="lg:col-span-8 space-y-6">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {dateTabs.map(d => (
                  <button key={d.id} onClick={() => setSelectedDate(d.id)} className={`min-w-[80px] flex flex-col items-center p-4 rounded-2xl border transition-all ${selectedDate === d.id ? 'bg-white text-black' : 'bg-zinc-900/40 text-zinc-500'}`}>
                    <div className="text-[9px] font-black uppercase mb-1.5">{d.dayName}</div>
                    <span className="text-2xl font-black">{d.dateNum}</span>
                  </button>
                ))}
            </div>

            <section className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-8 min-h-[400px]">
              <div className="space-y-6">
                {fetchingShowtimes ? <Loader2 className="animate-spin text-red-600 mx-auto py-20" /> : movies.length > 0 ? (
                  movies.map((m, idx) => (
                    <MovieShowtimeItem 
                      key={m.id || idx} 
                      movie={m} 
                      onSelect={(movieData: any, st: any, format: any) => setBooking({ 
                        ...movieData, 
                        id: st.id,      // ĐÂY LÀ SHOWTIME_ID THẬT
                        time: st.time, 
                        format, 
                        roomId: st.roomId 
                      })} 
                    />
                  ))
                ) : ( <p className="text-center py-20 opacity-30 font-black uppercase text-[10px]">Không có suất chiếu</p> )}
              </div>
            </section>
          </main>
        </div>
      </div>
      {booking && <BookingModal info={booking} onClose={() => setBooking(null)} />}
    </div>
  );
}
