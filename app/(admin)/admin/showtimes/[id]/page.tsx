"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Clock, Monitor, MapPin, 
  Film, Star, Info, Loader2, Edit3, Trash2, Calendar
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { apiRequest } from '@/app/lib/api';
import toast from 'react-hot-toast';
import ShowtimeModal from '../ShowtimeModal'; 

export default function ChiTietSuatChieu() {
  const router = useRouter();
  const { id } = useParams();
  
  const [data, setData] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const ID_RAP_GIA_LAP = 1;

  const fetchData = useCallback(async () => {
    try {
      const [resShow, resRoom, resMovie] = await Promise.all([
        apiRequest(`/api/v1/showtimes/${id}`),
        apiRequest(`/api/v1/rooms/cinema-item/${ID_RAP_GIA_LAP}`),
        apiRequest("/api/v1/movies"),
      ]);

      if (resShow.ok) {
        const result = await resShow.json();
        setData(result.data);
      } else {
        toast.error("Không tìm thấy suất chiếu!");
        router.push('/admin/showtimes');
      }

      if (resRoom.ok && resMovie.ok) {
        const r = await resRoom.json();
        const m = await resMovie.json();
        setRooms(Array.isArray(r.data) ? r.data : []);
        // Xử lý lấy list phim từ data.content hoặc data
        const movieList = m.data?.content || m.data || [];
        setMovies(Array.isArray(movieList) ? movieList : []);
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Hàm xử lý Lưu sau khi Sửa
  const handleSaveEdit = async (formData: any) => {
    const toastId = toast.loading("Đang cập nhật hệ thống...");
    try {
      const res = await apiRequest(`/api/v1/showtimes/${formData.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...formData, cinemaItemId: ID_RAP_GIA_LAP, price: 75000 }),
      });

      if (res.ok) {
        toast.success("Cập nhật thành công!", { id: toastId });
        setIsEditModalOpen(false);
        fetchData(); 
      } else {
        const result = await res.json();
        toast.error(result.message || "Trùng lịch chiếu!", { id: toastId });
      }
    } catch (e) {
      toast.error("Lỗi hệ thống!", { id: toastId });
    }
  };

  // Hàm xử lý Xóa
  const handleDelete = async () => {
    if (!window.confirm("Bà có chắc muốn xóa suất chiếu này không?")) return;
    const toastId = toast.loading("Đang xóa...");
    try {
      const res = await apiRequest(`/api/v1/showtimes/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa suất chiếu!", { id: toastId });
        router.push('/admin/showtimes');
      } else {
        toast.error("Không thể xóa!");
      }
    } catch (e) { toast.error("Lỗi kết nối!"); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={40} />
    </div>
  );

  if (!data) return null;

  // --- LOGIC FIX GIỜ KẾ THÚC ---
  const startTime = new Date(data.startTime);
  const movieDuration = data.movie.duration || 0;
  const endTime = new Date(startTime.getTime() + movieDuration * 60000);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 p-6 font-sans">
      <div className="max-w-4xl mx-auto"> 
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Quay lại danh sách
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* CỘT TRÁI: POSTER & ACTIONS */}
          <div className="md:col-span-4 space-y-4">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/5 shadow-2xl group">
              <img 
                src={data.movie.posterUrl} 
                alt={data.movie.title}
                className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-2 py-1 bg-red-600 text-white text-[8px] font-[1000] uppercase italic rounded mb-1 inline-block">
                  {data.movie.genre?.name || "Phim"}
                </span>
                <h1 className="text-xl font-[1000] uppercase italic text-white tracking-tighter leading-tight">
                  {data.movie.title}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
               <button 
                 onClick={() => setIsEditModalOpen(true)}
                 className="flex flex-col items-center justify-center gap-1 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase hover:bg-zinc-200 transition-all active:scale-95 shadow-lg"
               >
                 <Edit3 size={16} /> Sửa lịch
               </button>
               <button 
                 onClick={handleDelete}
                 className="flex flex-col items-center justify-center gap-1 py-3 bg-zinc-900 text-red-500 rounded-xl font-black text-[10px] uppercase border border-white/5 hover:bg-red-600 hover:text-white transition-all active:scale-95"
               >
                 <Trash2 size={16} /> Xóa suất
               </button>
            </div>
          </div>

          {/* CỘT PHẢI: INFO CHI TIẾT */}
          <div className="md:col-span-8 space-y-4">
            
            {/* Box Thời gian - ĐÃ FIX KẾT THÚC */}
            <div className="flex gap-4 p-6 bg-zinc-900/50 border border-white/5 rounded-[1.5rem] backdrop-blur-sm">
               <div className="flex-1 border-r border-white/10">
                 <div className="flex items-center gap-2 mb-1 opacity-80 uppercase font-black text-[9px] text-zinc-500 tracking-widest">
                   <Clock size={12} className="text-red-600"/> Bắt đầu
                 </div>
                 <p className="text-3xl font-[1000] italic uppercase text-white tracking-tighter">
                   {startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                 </p>
                 <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase flex items-center gap-1">
                   <Calendar size={10} /> {startTime.toLocaleDateString('vi-VN')}
                 </p>
               </div>
               
               <div className="flex-1 pl-4">
                 <div className="flex items-center gap-2 mb-1 opacity-80 uppercase font-black text-[9px] text-zinc-500 tracking-widest">
                   <Clock size={12} /> Kết thúc dự kiến
                 </div>
                 <p className="text-3xl font-[1000] italic uppercase text-zinc-400 tracking-tighter">
                   {endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                 </p>
                 <p className="text-[10px] font-bold text-red-600 mt-1 uppercase tracking-widest">
                    Thời lượng: {movieDuration} PHÚT
                 </p>
               </div>
            </div>

            {/* Box Vị trí Phòng/Rạp */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] hover:border-white/10 transition-colors">
                <Monitor size={16} className="text-red-600 mb-2"/>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Hall Room</p>
                <h3 className="text-lg font-[1000] uppercase italic text-white">{data.room.name}</h3>
                <p className="text-[10px] font-bold text-zinc-500 mt-2">{data.room.totalSeats} Ghế trống</p>
              </div>
              <div className="p-5 bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] hover:border-white/10 transition-colors">
                <MapPin size={16} className="text-red-600 mb-2"/>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Cơ sở vận hành</p>
                <h3 className="text-lg font-[1000] uppercase italic text-white truncate">{data.cinemaItem.name}</h3>
                <p className="text-[10px] font-bold text-zinc-500 mt-2 truncate">{data.cinemaItem.city}</p>
              </div>
            </div>

            {/* Box Thông tin phim tóm tắt */}
            <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-[1.5rem]">
               <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4 mb-4">
                 <div>
                   <p className="text-[9px] text-zinc-600 font-black uppercase mb-1">Đạo diễn</p>
                   <p className="text-[11px] text-zinc-200 font-bold italic">{data.movie.director}</p>
                 </div>
                 <div>
                   <p className="text-[9px] text-zinc-600 font-black uppercase mb-1">Quốc gia</p>
                   <p className="text-[11px] text-zinc-200 font-bold italic">{data.movie.country}</p>
                 </div>
                 <div>
                   <p className="text-[9px] text-zinc-600 font-black uppercase mb-1">IMDb</p>
                   <div className="flex items-center gap-1 text-yellow-500 mt-1">
                     <Star size={10} fill="currentColor" />
                     <span className="text-[11px] font-black">{data.movie.rating}/5</span>
                   </div>
                 </div>
               </div>
               
               <div className="flex items-center gap-2 mb-3">
                  <Info size={14} className="text-red-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Nội dung phim</span>
               </div>
               <p className="text-xs leading-relaxed text-zinc-500 italic font-medium line-clamp-4 hover:line-clamp-none transition-all cursor-help">
                  "{data.movie.description}"
               </p>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL SỬA: Dùng chung Form bà đã làm ở trang Danh sách */}
      <ShowtimeModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={handleSaveEdit} 
        editData={data} 
        movies={movies} 
        rooms={rooms} 
      />
    </div>
  );
}