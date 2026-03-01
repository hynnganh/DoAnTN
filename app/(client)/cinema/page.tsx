"use client";
import React, { useState, useMemo } from 'react';
import { Search, MapPin, X, Ticket, Clock, Info } from 'lucide-react';
import BookingModal from './components/BookingModal';

// --- 1. DATA NỘI BỘ SÀI GÒN (Mở rộng thêm ví dụ) ---
const SG_DATA = [
  {
    id: 1, name: "A&K Bến Thành", address: "Số 12 Lê Lợi, Quận 1",
    schedules: { 
      "28": [
        { title: "THỎ ƠI!!", tag: "T18", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400", formats: [{ type: "2D PHỤ ĐỀ", times: ["09:00", "14:30", "22:30"] }] },
        { title: "DUNE: PHẦN 2", tag: "T13", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400", formats: [{ type: "IMAX 2D", times: ["10:00", "19:00"] }] }
      ],
      "1": [{ title: "THỎ ƠI!!", tag: "T18", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400", formats: [{ type: "2D PHỤ ĐỀ", times: ["10:00", "15:00"] }] }]
    }
  },
  {
    id: 2, name: "A&K Thảo Điền", address: "Vincom Mega Mall, Quận 2",
    schedules: { 
      "28": [
        { title: "ĐỒI GIÓ HÚ", tag: "T16", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400", formats: [{ type: "2D PHỤ ĐỀ", times: ["10:00", "15:00", "20:00"] }] },
        { title: "MAI", tag: "T18", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400", formats: [{ type: "2D VIỆT NAM", times: ["13:00", "18:00", "23:00"] }] }
      ]
    }
  },
  {
    id: 3, name: "A&K Crescent Mall", address: "Đại lộ Nguyễn Văn Linh, Quận 7",
    schedules: { 
      "28": [{ title: "BÁU VẬT", tag: "P", image: "https://images.unsplash.com/photo-1598899139113-247240407d9b?q=80&w=400", formats: [{ type: "2D LỒNG TIẾNG", times: ["08:30", "13:00", "19:00"] }] }] 
    }
  },
  {
    id: 4, name: "A&K Landmark 81", address: "Vinhomes Central Park, Bình Thạnh",
    schedules: { 
      "28": [{ title: "KUNG FU PANDA 4", tag: "P", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=400", formats: [{ type: "3D LỒNG TIẾNG", times: ["09:00", "11:30", "14:00"] }] }] 
    }
  }
];

// --- 2. SUB-COMPONENTS ---

// Thẻ rạp chiếu
const CinemaItem = ({ cinema, isActive, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-5 rounded-[2rem] transition-all duration-300 border ${isActive ? 'bg-red-600 border-red-600 shadow-xl' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
  >
    <h3 className={`text-sm font-black uppercase tracking-tight ${isActive ? 'text-white' : 'text-gray-200'}`}>{cinema.name}</h3>
    <p className={`text-[10px] mt-1 ${isActive ? 'text-red-100' : 'text-gray-500'}`}>{cinema.address}</p>
  </button>
);

// Thẻ phim và suất chiếu
const MovieItem = ({ movie, onSelect }: any) => (
  <div className="flex flex-col md:flex-row gap-6 pb-8 border-b border-white/5 last:border-0">
    <img src={movie.image} className="w-24 h-36 rounded-xl object-cover shadow-2xl self-start" alt={movie.title} />
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded text-white ${movie.tag === 'P' ? 'bg-green-600' : 'bg-red-600'}`}>{movie.tag}</span>
        <h4 className="text-lg font-black uppercase tracking-tight">{movie.title}</h4>
      </div>
      {movie.formats.map((f: any, i: number) => (
        <div key={i} className="mb-4">
          <p className="text-[9px] text-gray-500 font-black mb-2 uppercase tracking-[0.2em] flex items-center gap-1">
            <Ticket size={10} /> {f.type}
          </p>
          <div className="flex flex-wrap gap-2">
            {f.times.map((t: string) => (
              <button 
                key={t} 
                onClick={() => onSelect(movie, t, f.type)} 
                className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-black hover:bg-red-600 hover:border-red-600 transition-all active:scale-95"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);


// --- 3. COMPONENT CHÍNH ---
export default function Cinema() {
  const [selectedId, setSelectedId] = useState(1);
  const [selectedDate, setSelectedDate] = useState("28");
  const [searchTerm, setSearchTerm] = useState("");
  const [booking, setBooking] = useState<any>(null);

  const activeCinema = useMemo(() => SG_DATA.find(c => c.id === selectedId) || SG_DATA[0], [selectedId]);
  
  const filteredCinemas = useMemo(() => 
    SG_DATA.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())), 
  [searchTerm]);

  const movies = useMemo(() => 
    activeCinema.schedules[selectedDate as keyof typeof activeCinema.schedules] || [], 
  [activeCinema, selectedDate]);

  return (
    <div className="bg-[#050505] min-h-screen pt-12 md:pt-20 pb-10 px-4 md:px-6 text-white font-sans selection:bg-red-600 selection:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">Hệ thống <span className="text-red-600">Sài Gòn</span></h1>
            <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-[0.4em] mt-3">A&K Cinema Network - Ho Chi Minh City</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List Rạp (Trái) */}
          <aside className="lg:col-span-4 bg-white/[0.03] rounded-[2.5rem] p-4 border border-white/5 h-[600px] flex flex-col shadow-2xl backdrop-blur-xl">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm rạp theo tên, quận..." 
                className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-4 rounded-2xl text-xs outline-none focus:border-red-600 transition-all"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {filteredCinemas.length > 0 ? (
                filteredCinemas.map(c => (
                  <CinemaItem key={c.id} cinema={c} isActive={selectedId === c.id} onClick={() => setSelectedId(c.id)} />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 text-xs font-bold uppercase">Không tìm thấy rạp</div>
              )}
            </div>
          </aside>

          {/* Lịch Chiếu (Phải) */}
          <main className="lg:col-span-8 space-y-6">
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {[
                { id: "28", label: "Hôm nay", sub: "28/02" },
                { id: "1", label: "Thứ Hai", sub: "01/03" },
                { id: "2", label: "Thứ Ba", sub: "02/03" }
              ].map(d => (
                <button 
                  key={d.id} onClick={() => setSelectedDate(d.id)}
                  className={`px-8 py-3 rounded-2xl border text-xs font-black transition-all flex flex-col items-center min-w-[120px] ${selectedDate === d.id ? 'bg-white text-black border-white shadow-xl scale-105' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                >
                  <span className="uppercase">{d.label}</span>
                  <span className="text-[9px] opacity-60 font-bold">{d.sub}</span>
                </button>
              ))}
            </div>

            <section className="bg-white/[0.03] rounded-[3rem] p-6 md:p-10 border border-white/5 min-h-[500px] shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <h2 className="text-xl md:text-2xl font-black uppercase text-red-500 flex items-center gap-2">
                  <MapPin size={22} /> {activeCinema.name}
                </h2>
                <div className="hidden md:flex items-center gap-2 text-gray-500 text-[9px] font-black uppercase tracking-widest">
                  <Info size={12}/> Suất chiếu có thể thay đổi
                </div>
              </div>
              
              <div className="space-y-10">
                {movies.length > 0 ? (
                  movies.map((m, i) => (
                    <MovieItem key={i} movie={m} onSelect={(m:any, t:any, f:any) => setBooking({title: m.title, time: t, format: f})} />
                  ))
                ) : (
                  <div className="text-center py-20 opacity-20">
                    <Clock size={48} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-tighter">Hết suất chiếu trong ngày</p>
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
      `}</style>
    </div>
  );
}