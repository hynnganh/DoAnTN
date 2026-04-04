"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Monitor, Film, Loader2, Clock, ArrowRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import ShowtimeModal from "./ShowtimeModal";
import { apiRequest } from "@/app/lib/api"; 
import toast from "react-hot-toast";

export default function AdminShowtimePage() {
  const router = useRouter();
  const ID_RAP_GIA_LAP = 1;

  const [loading, setLoading] = useState(true);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const dateTabs = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        full: d.toISOString().split('T')[0],
        label: i === 0 ? "Hôm nay" : d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit' })
      };
    });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [resShow, resRoom, resMovie] = await Promise.all([
        apiRequest(`/api/v1/showtimes/cinema-item/${ID_RAP_GIA_LAP}`),
        apiRequest(`/api/v1/rooms/cinema-item/${ID_RAP_GIA_LAP}`),
        apiRequest("/api/v1/movies"),
      ]);

      if (resShow.ok && resRoom.ok && resMovie.ok) {
        const [s, r, m] = await Promise.all([resShow.json(), resRoom.json(), resMovie.json()]);
        setShowtimes(Array.isArray(s.data) ? s.data : []);
        setRooms(Array.isArray(r.data) ? r.data : []);
        
        // FIX: Lấy data.content từ API phim
        const movieList = m.data?.content || m.data || [];
        setMovies(Array.isArray(movieList) ? movieList : []);
      }
    } catch (e) { toast.error("Lỗi server!"); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (data: any) => {
    const isUpdate = !!data.id;
    const toastId = toast.loading(isUpdate ? "Đang cập nhật..." : "Đang tạo suất chiếu...");

    try {
      const res = await apiRequest(isUpdate ? `/api/v1/showtimes/${data.id}` : "/api/v1/showtimes", {
        method: isUpdate ? "PUT" : "POST",
        body: JSON.stringify({ ...data, cinemaItemId: ID_RAP_GIA_LAP, price: 75000 }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(
          <div className="flex flex-col"><span className="font-bold">Thành công!</span><span className="text-[10px]">Lịch chiếu đã được ghi nhận.</span></div>,
          { id: toastId }
        );
        setIsModalOpen(false);
        loadData();
      } else {
        toast.error(
          <div className="flex flex-col"><span className="font-bold">Lỗi hệ thống</span><span className="text-[10px]">{result.message || "Giờ này đã có phim khác chiếu!"}</span></div>,
          { id: toastId, duration: 4000 }
        );
      }
    } catch (e) { toast.error("Trùng lịch chiếu!", { id: toastId }); }
  };

  const getFilteredShows = (roomId: number) => {
    return showtimes.filter(s => s.startTime?.split('T')[0] === selectedDate && Number(s.room?.id) === Number(roomId));
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]"><Loader2 className="animate-spin text-red-600" /></div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 p-4 md:p-2 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-zinc-900 rounded-2xl text-red-600 border border-white/5 shadow-2xl"><Clock size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">Schedule Manager</p>
              <h1 className="text-2xl font-[1000] uppercase italic text-white tracking-tighter">LỊCH CHIẾU <span className="text-red-600">RẠP 01</span></h1>
            </div>
          </div>
          <button onClick={() => { setSelectedItem(null); setIsModalOpen(true); }} className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-xl">+ Tạo suất chiếu</button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
          {dateTabs.map(tab => (
            <button key={tab.full} onClick={() => setSelectedDate(tab.full)} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedDate === tab.full ? "bg-red-600 text-white border-red-600" : "bg-zinc-900/50 text-zinc-500 border-white/5"}`}>{tab.label}</button>
          ))}
        </div>

        <div className="space-y-4">
          {rooms.map(room => (
            <div key={room.id} className="group bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 hover:border-white/10 transition-all shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-full md:w-44 shrink-0">
                <div className="flex items-center gap-2 mb-1"><Monitor size={14} className="text-zinc-800 group-hover:text-red-600 transition-colors" /><span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Hall Room</span></div>
                <h3 className="text-lg font-black uppercase italic text-zinc-200">{room.name}</h3>
                <p className="text-[9px] font-bold text-zinc-800 uppercase mt-1">{room.totalSeats} SEATS</p>
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-3">
                {getFilteredShows(room.id).length > 0 ? getFilteredShows(room.id).map(s => (
                  <div key={s.id} onClick={() => router.push(`/admin/showtimes/${s.id}`)} className="group/item relative flex items-center gap-3 pl-3 pr-4 py-2 bg-zinc-900/40 border border-white/5 rounded-xl hover:bg-white hover:border-white transition-all cursor-pointer shadow-sm">
                    <span className="text-red-600 font-black text-[11px] italic group-hover/item:text-black">{s.startTime?.split('T')[1].substring(0, 5)}</span>
                    <div className="w-[1px] h-3 bg-zinc-800 group-hover/item:bg-zinc-200"></div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500 group-hover/item:text-black max-w-[150px] truncate">{s.movie?.title}</p>
                    <ArrowRight size={10} className="text-zinc-800 opacity-0 group-hover/item:opacity-100 transition-all -ml-1 group-hover/item:text-black" />
                  </div>
                )) : <span className="text-[9px] font-black uppercase italic text-zinc-900 tracking-[0.2em]">Trống lịch chiếu</span>}
                <button onClick={() => { setSelectedItem({ roomId: room.id, startTime: selectedDate }); setIsModalOpen(true); }} className="w-9 h-9 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-zinc-800 hover:text-red-600 hover:border-red-600/40 transition-all"><Plus size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ShowtimeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} editData={selectedItem} movies={movies} rooms={rooms} />
    </div>
  );
}