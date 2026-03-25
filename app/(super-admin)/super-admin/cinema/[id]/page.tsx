"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, MapPin, Tv, Calendar, Clock, 
  Loader2, Plus, Film, Trash2, LayoutGrid
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CinemaDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const [cinema, setCinema] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('showtimes');

  // --- CALL API LẤY DỮ LIỆU THẬT ---
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Lấy chi tiết rạp (Bà check lại endpoint này bên CinemaItemController nhé)
      const cinemaRes = await fetch(`http://localhost:8080/api/v1/cinema-items/${params.id}`);
      const cinemaJson = await cinemaRes.json();

      // 2. Lấy danh sách suất chiếu của rạp này (Khớp với ShowtimeController của bà)
      const showtimeRes = await fetch(`http://localhost:8080/api/v1/showtimes/cinema-item/${params.id}`);
      const showtimeJson = await showtimeRes.json();

      if (cinemaRes.ok) setCinema(cinemaJson.data);
      if (showtimeRes.ok) setShowtimes(showtimeJson.data || []);

    } catch (err) {
      toast.error("Không thể kết nối Server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchData();
  }, [params.id]);

  // --- HÀM XÓA SUẤT CHIẾU ---
  const handleDeleteShowtime = async (showtimeId: number) => {
    if(!confirm("Bà có chắc muốn xóa suất chiếu này không?")) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/v1/showtimes/${showtimeId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Cần token vì có @PreAuthorize
        }
      });
      if (res.ok) {
        toast.success("Đã xóa suất chiếu!");
        fetchData(); // Load lại data
      }
    } catch (err) {
      toast.error("Lỗi khi xóa!");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-red-600" size={48} />
      <p className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em]">Đang đồng bộ SQL...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <div className="p-6 border-b border-white/5 bg-zinc-900/10 sticky top-0 backdrop-blur-md z-10 flex justify-between items-center">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} /> Quay lại
        </button>
        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
            Hệ thống quản trị Vinacenter
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        {/* Cinema Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="space-y-4">
            <span className="bg-red-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase italic shadow-lg shadow-red-600/20">
              {cinema?.cinema?.name || 'HỆ THỐNG RẠP'}
            </span>
            <h1 className="text-6xl md:text-8xl font-[1000] italic uppercase tracking-tighter leading-none">
              {cinema?.name}
            </h1>
            <div className="flex items-center gap-3 text-zinc-400 font-bold">
              <MapPin size={20} className="text-red-600" />
              <span className="text-lg">{cinema?.address}, {cinema?.city}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-zinc-900/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-sm min-w-[280px]">
             <div className="text-center">
                <p className="text-[10px] text-zinc-500 font-black uppercase mb-1">Giờ/Phòng</p>
                <p className="text-3xl font-[1000] italic text-white">{cinema?.hoursPerRoom}h</p>
             </div>
             <div className="text-center border-l border-white/10">
                <p className="text-[10px] text-zinc-500 font-black uppercase mb-1">Suất chiếu</p>
                <p className="text-3xl font-[1000] italic text-red-600">{showtimes.length}</p>
             </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-8 border-b border-white/5 mb-10">
          <button 
            onClick={() => setActiveTab('showtimes')}
            className={`pb-5 text-sm font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === 'showtimes' ? 'text-white' : 'text-zinc-600'}`}
          >
            Lịch chiếu tại rạp
            {activeTab === 'showtimes' && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />}
          </button>
        </div>

        {/* Showtimes List */}
        <div className="grid grid-cols-1 gap-4">
          {showtimes.length > 0 ? (
            showtimes.map((st: any) => (
              <div key={st.id} className="group bg-zinc-900/20 border border-white/5 hover:border-red-600/30 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 transition-all">
                {/* Movie Info */}
                <div className="w-full md:w-20 h-20 bg-red-600/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Film size={32} className="text-red-600" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-[1000] italic uppercase text-white group-hover:text-red-600 transition-colors">
                    {st.movie?.title || st.movieName || "Đang cập nhật phim"}
                  </h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {st.showDate || st.date}</span>
                    <span className="flex items-center gap-1 text-white"><Clock size={14} className="text-red-600" /> {st.startTime}</span>
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-zinc-400">
                      {st.room?.name || "Phòng chờ"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block mr-4">
                        <p className="text-[10px] font-black text-zinc-600 uppercase italic">Giá vé niêm yết</p>
                        <p className="text-xl font-[1000] italic text-emerald-500">{st.price?.toLocaleString() || '85.000'}đ</p>
                    </div>
                    <button 
                        onClick={() => handleDeleteShowtime(st.id)}
                        className="h-14 w-14 bg-white/5 hover:bg-red-600/20 hover:text-red-600 rounded-2xl flex items-center justify-center transition-all text-zinc-500"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-zinc-600">
                <LayoutGrid size={48} className="mb-4 opacity-20" />
                <p className="font-black uppercase text-[10px] tracking-widest">Rạp này chưa có suất chiếu nào</p>
                <button className="mt-6 text-red-600 font-black uppercase text-[10px] hover:underline transition-all">
                    + Tạo suất chiếu ngay
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}