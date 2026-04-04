"use client";
import React, { useState, useEffect } from "react";
import { X, Save, Calendar, Monitor, Film, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface ShowtimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData: any;
  movies: any[];
  rooms: any[];
}

export default function ShowtimeModal({ isOpen, onClose, onSave, editData, movies, rooms }: ShowtimeModalProps) {
  const [formData, setFormData] = useState<any>({
    movieId: 0,
    roomId: 0,
    cinemaItemId: 1, 
    startTime: "",
  });

  // Ép kiểu mảng an toàn
  const safeMovies = Array.isArray(movies) ? movies : [];
  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const currentMovie = safeMovies.find(m => m.id === formData.movieId);

  useEffect(() => {
    if (isOpen) {
      if (editData && editData.id) {
        try {
          const date = new Date(editData.startTime);
          const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 16);

          setFormData({
            id: editData.id,
            movieId: editData.movie?.id || editData.movieId || 0,
            roomId: editData.room?.id || editData.roomId || 0,
            cinemaItemId: editData.cinemaItemId || 1,
            startTime: localISO,
          });
        } catch (e) { console.error("Lỗi date:", e); }
      } else {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        setFormData({ 
          movieId: 0, 
          roomId: editData?.roomId || 0, 
          cinemaItemId: 1, 
          startTime: editData?.startTime ? `${editData.startTime}T${timeStr}` : "" 
        });
      }
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleAction = () => {
    if (!formData.movieId || !formData.roomId || !formData.startTime) {
      toast.error("Vui lòng điền đầy đủ thông tin!", { icon: '⚠️' });
      return;
    }

    const startNew = new Date(formData.startTime).getTime();
    if (startNew < Date.now()) {
      toast.error("Giờ chiếu không được ở quá khứ !", { icon: '🕒' });
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#0c0c0e] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-[1000] italic uppercase text-white tracking-tighter">
              {editData?.id ? "Cập nhật" : "Thiết lập"} <span className="text-red-600">Suất chiếu</span>
            </h3>
            <div className="h-1 w-12 bg-red-600 rounded-full" />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-600 transition-all hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Movie */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">
              <Film size={12} className="text-red-600" /> Chọn phim
            </label>
            <select
              value={formData.movieId}
              onChange={(e) => setFormData({ ...formData, movieId: Number(e.target.value) })}
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm text-white outline-none focus:border-red-600/50 appearance-none cursor-pointer hover:bg-zinc-800 transition-all"
            >
              <option value={0} disabled>-- Danh sách phim --</option>
              {safeMovies.map((m) => (
                <option key={m.id} value={m.id}>{m.title} ({m.duration}p)</option>
              ))}
            </select>
          </div>

          {/* Room */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">
              <Monitor size={12} className="text-red-600" /> Phòng chiếu
            </label>
            <select
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: Number(e.target.value) })}
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm text-white outline-none focus:border-red-600/50 appearance-none cursor-pointer hover:bg-zinc-800 transition-all"
            >
              <option value={0} disabled>-- Chọn phòng --</option>
              {safeRooms.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">
              <Calendar size={12} className="text-red-600" /> Giờ bắt đầu
            </label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm text-white outline-none focus:border-red-600/50 [color-scheme:dark] hover:bg-zinc-800 transition-all"
            />
            
            {/* Giờ kết thúc dự kiến */}
            {formData.startTime && currentMovie && (
              <div className="mt-4 p-4 bg-red-600/5 border border-red-600/20 rounded-2xl flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-red-600 tracking-widest">Kết thúc dự kiến:</span>
                <span className="text-white font-black italic">
                  {new Date(new Date(formData.startTime).getTime() + currentMovie.duration * 60000)
                    .toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleAction}
            className="w-full bg-white text-black py-5 rounded-2xl font-[1000] uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-xl mt-4"
          >
            <Save size={18} strokeWidth={3} /> Xác nhận hệ thống
          </button>
        </div>
      </div>
    </div>
  );
}