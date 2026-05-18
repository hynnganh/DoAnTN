"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Edit3, Calendar as CalendarIcon, Loader2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useRouter } from 'next/navigation';
import ShowtimeModal from "./ShowtimeModal";
import { apiAdminRequest } from "@/app/lib/api"; 
import toast from "react-hot-toast";

// Mảng bản đồ ngày cố định tránh lỗi Hydration do Locale của hệ thống khác nhau
const VIETNAMESE_DAYS = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

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

  // Kiểm tra xem ngày đang chọn có phải là ngày trong quá khứ không
  const isPastDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(selectedDate);
    target.setHours(0, 0, 0, 0);
    return target < today;
  }, [selectedDate]);

  const weekTabs = useMemo(() => {
    const current = new Date(selectedDate);
    const dayOfWeek = current.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(current);
    monday.setDate(current.getDate() - diffToMonday);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      
      return {
        full: iso,
        label: VIETNAMESE_DAYS[d.getDay()], 
        dayNum: d.getDate(),
        isToday: iso === new Date().toISOString().split('T')[0],
        isOld: new Date(iso).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)
      };
    });
  }, [selectedDate]);

  const changeWeek = (direction: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + (direction * 7));
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const resUser = await apiAdminRequest('/api/v1/users/me');
      const userRes = await resUser.json();
      const idRap = userRes.data?.managedCinemaItemId;
      if (!idRap) return;
      
      setCinemaId(idRap);
      const [resCinema, resShow, resRoom, resMovie] = await Promise.all([
        apiAdminRequest(`/api/v1/cinema-items/${idRap}`),
        apiAdminRequest(`/api/v1/showtimes/cinema-item/${idRap}`),
        apiAdminRequest(`/api/v1/rooms/cinema-item/${idRap}`),
        apiAdminRequest("/api/v1/movies?status=SHOWING"),
      ]);

      const [c, s, r, m] = await Promise.all([resCinema.json(), resShow.json(), resRoom.json(), resMovie.json()]);
      setCinemaName(c.data?.name || `Cơ sở #${idRap}`);
      setShowtimes(s.data || []);
      setRooms(r.data || []);
      setMovies(m.data?.content || m.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (data: any) => {
    const now = new Date();
    const showtimeDate = new Date(data.startTime);

    if (showtimeDate < now) {
      return toast.error("Không thể thao tác suất chiếu vào thời gian đã qua!");
    }

    const isUpdate = !!data.id;
    const tid = toast.loading(isUpdate ? "Đang cập nhật..." : "Đang tạo mới...");
    try {
      const res = await apiAdminRequest(isUpdate ? `/api/v1/showtimes/${data.id}` : "/api/v1/showtimes", {
        method: isUpdate ? "PUT" : "POST",
        body: JSON.stringify({ ...data, cinemaItemId: cinemaId, price: 75000 }),
      });
      if (res.ok) {
        toast.success("Thao tác thành công!", { id: tid });
        setIsModalOpen(false);
        loadData();
      } else {
        const err = await res.json();
        toast.error(err.message || "Lỗi trùng lịch chiếu!", { id: tid });
      }
    } catch (e) { toast.error("Lỗi kết nối máy chủ!", { id: tid }); }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-zinc-400 p-6 font-sans select-none tracking-tight">
      <div className="max-w-6xl mx-auto">
        
        {/* TIÊU ĐỀ CHÍNH */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              Lịch chiếu <span className="text-red-600">{cinemaName}</span>
            </h1>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-wider mt-2">Điều phối lịch chiếu phim nội bộ</p>
          </div>
          {!isPastDate && (
            <button 
              onClick={() => { setSelectedItem(null); setIsModalOpen(true); }} 
              className="px-6 py-3 bg-white text-black rounded-xl font-black text-[11px] uppercase hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm"
            >
              + Tạo suất chiếu
            </button>
          )}
        </div>

        {/* THANH ĐIỀU HƯỚNG THỜI GIAN VÀ NGÀY THÁNG */}
        <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-xl mb-6 flex flex-col md:flex-row items-center gap-4 shadow-sm">
          <div className="flex items-center gap-1.5 px-1">
             <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
             <div className="flex items-center gap-2 bg-[#060608] px-3 py-1.5 rounded-lg border border-zinc-900">
               <CalendarIcon size={12} className="text-red-600" />
               <input 
                 type="date" 
                 value={selectedDate}
                 onChange={(e) => setSelectedDate(e.target.value)}
                 className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer [color-scheme:dark]"
               />
             </div>
             <button onClick={() => changeWeek(1)} className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors"><ChevronRight size={16} /></button>
          </div>

          <div className="flex-1 flex justify-between w-full md:w-auto px-1 overflow-x-auto no-scrollbar gap-1.5">
            {weekTabs.map(tab => (
              <button 
                key={tab.full} 
                onClick={() => setSelectedDate(tab.full)}
                className={`flex flex-col items-center min-w-[58px] py-2 rounded-xl transition-all ${
                  selectedDate === tab.full ? "bg-red-600 text-white" : "text-zinc-400 hover:bg-zinc-900"
                } ${tab.isOld ? "opacity-30" : ""}`}
              >
                <span className="text-[8px] font-black uppercase tracking-tight opacity-70 mb-0.5">{tab.label}</span>
                <span className="text-xs font-black">{tab.dayNum}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CẢNH BÁO LỊCH QUÁ KHỨ */}
        {isPastDate && (
          <div className="mb-6 flex items-center gap-2.5 p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl text-amber-500">
            <AlertCircle size={14} />
            <p className="text-[9px] font-black uppercase tracking-wider">Bạn đang xem lịch diễn thuộc quá khứ. Các chức năng thêm mới hoặc sửa đổi sẽ bị khóa.</p>
          </div>
        )}

        {/* DANH SÁCH LƯỚI PHÒNG CHIẾU */}
        {loading ? (
          <div className="flex flex-col items-center py-40 gap-3 opacity-40">
            <Loader2 className="animate-spin text-red-600" size={32} />
            <span className="text-[9px] font-black uppercase tracking-wider">Đang cập nhật lịch chiếu...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map(room => (
              <div key={room.id} className={`bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4 ${isPastDate ? "opacity-60" : ""}`}>
                <div className="w-28 shrink-0">
                  <h3 className="text-sm font-black uppercase tracking-tight text-zinc-500">{room.name}</h3>
                </div>
                
                <div className="flex-1 flex flex-wrap gap-2">
                  {showtimes
                    .filter(s => s.startTime?.startsWith(selectedDate) && s.room?.id === room.id)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(s => {
                      const isPassed = new Date(s.startTime) < new Date();
                      return (
                        <div 
                          key={s.id} 
                          className={`group flex items-center gap-2.5 bg-[#060608] border border-zinc-900 pl-3 pr-1.5 py-1.5 rounded-lg transition-all ${isPassed ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-zinc-800"}`}
                          onClick={() => !isPassed && router.push(`/admin/showtimes/${s.id}`)}
                        >
                          <span className="text-red-600 font-black text-xs">{s.startTime.split('T')[1].substring(0, 5)}</span>
                          <p className="text-[9px] font-black uppercase truncate max-w-[110px] text-zinc-400">{s.movie?.title}</p>
                          {!isPassed && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedItem(s); setIsModalOpen(true); }} 
                              className="p-1 text-zinc-600 hover:text-red-600"
                              title="Sửa nhanh"
                            >
                              <Edit3 size={11} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  
                  {!isPastDate && (
                    <button 
                      onClick={() => { setSelectedItem({ roomId: room.id, startTime: selectedDate }); setIsModalOpen(true); }} 
                      className="w-8 h-8 border border-dashed border-zinc-800 hover:border-red-600/50 rounded-lg flex items-center justify-center text-zinc-700 hover:text-red-600 transition-all"
                      title="Thêm suất vào phòng"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ShowtimeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        editData={selectedItem} 
        movies={movies} 
        rooms={rooms} 
      />
    </div>
  );
}