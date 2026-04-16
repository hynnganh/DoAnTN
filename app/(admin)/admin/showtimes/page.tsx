"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Monitor, Clock, Loader2, Edit3 } from "lucide-react";
import { useRouter } from 'next/navigation';
import ShowtimeModal from "./ShowtimeModal";
import { apiRequest } from "@/app/lib/api"; 
import toast, { Toaster } from "react-hot-toast";

export default function AdminShowtimePage() {
  const router = useRouter();
  const [cinemaId, setCinemaId] = useState<number | null>(null);
  const [cinemaName, setCinemaName] = useState("");
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
      const resUser = await apiRequest('/api/v1/users/me');
      const userRes = await resUser.json();
      const idRap = userRes.data?.managedCinemaItemId;
      if (!idRap) return toast.error("Chưa được phân quyền rạp!");
      
      setCinemaId(idRap);
      const [resCinema, resShow, resRoom, resMovie] = await Promise.all([
        apiRequest(`/api/v1/cinema-items/${idRap}`),
        apiRequest(`/api/v1/showtimes/cinema-item/${idRap}`),
        apiRequest(`/api/v1/rooms/cinema-item/${idRap}`),
        apiRequest("/api/v1/movies?status=SHOWING"),
      ]);

      const [c, s, r, m] = await Promise.all([resCinema.json(), resShow.json(), resRoom.json(), resMovie.json()]);
      setCinemaName(c.data?.name || `CƠ SỞ #${idRap}`);
      setShowtimes(s.data || []);
      setRooms(r.data || []);
      setMovies(m.data?.content || m.data || []);
    } catch (e) {
      toast.error("Phiên đăng nhập hết hạn");
      router.push('/login');
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (data: any) => {
    const isUpdate = !!data.id;
    const tid = toast.loading(isUpdate ? "Đang cập nhật..." : "Đang tạo...");
    try {
      const res = await apiRequest(isUpdate ? `/api/v1/showtimes/${data.id}` : "/api/v1/showtimes", {
        method: isUpdate ? "PUT" : "POST",
        body: JSON.stringify({ ...data, cinemaItemId: cinemaId, price: 75000 }),
      });
      if (res.ok) {
        toast.success("Thành công!", { id: tid });
        setIsModalOpen(false);
        loadData();
      } else {
        const err = await res.json();
        toast.error(err.message || "Lỗi trùng lịch!", { id: tid });
      }
    } catch (e) { toast.error("Lỗi kết nối!", { id: tid }); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black italic uppercase italic tracking-tighter">LỊCH CHIẾU <span className="text-red-600">{cinemaName}</span></h1>
          <button onClick={() => { setSelectedItem(null); setIsModalOpen(true); }} className="px-6 py-3 bg-white text-black rounded-xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-all">+ Tạo suất mới</button>
        </div>

        <div className="flex gap-2 overflow-x-auto mb-8">
          {dateTabs.map(tab => (
            <button key={tab.full} onClick={() => setSelectedDate(tab.full)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase border transition-all shrink-0 ${selectedDate === tab.full ? "bg-red-600 border-red-600" : "bg-zinc-900 border-white/5 text-zinc-500"}`}>{tab.label}</button>
          ))}
        </div>

        <div className="space-y-4">
          {rooms.map(room => (
            <div key={room.id} className="bg-zinc-900/20 border border-white/5 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 shrink-0"><h3 className="text-lg font-black uppercase italic">{room.name}</h3></div>
              <div className="flex-1 flex flex-wrap gap-3">
                {showtimes.filter(s => s.startTime?.startsWith(selectedDate) && s.room?.id === room.id).map(s => (
                  <div key={s.id} onClick={() => router.push(`/admin/showtimes/${s.id}`)} className="group flex items-center gap-3 bg-zinc-900 border border-white/5 pl-4 pr-2 py-2 rounded-xl hover:bg-white hover:text-black transition-all cursor-pointer">
                    <span className="text-red-600 font-black text-xs italic group-hover:text-black">{s.startTime.split('T')[1].substring(0, 5)}</span>
                    <p className="text-[10px] font-black uppercase truncate max-w-[100px]">{s.movie?.title}</p>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedItem(s); setIsModalOpen(true); }} className="p-1.5 text-zinc-600 hover:text-red-600 transition-colors"><Edit3 size={12} /></button>
                  </div>
                ))}
                <button onClick={() => { setSelectedItem({ roomId: room.id, startTime: selectedDate }); setIsModalOpen(true); }} className="w-10 h-10 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-zinc-700 hover:text-red-600"><Plus size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ShowtimeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} editData={selectedItem} movies={movies} rooms={rooms} />
    </div>
  );
}