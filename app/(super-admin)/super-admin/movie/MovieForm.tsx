"use client";
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Save, Globe, Clock, Calendar, Loader2, Tag, Film } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { apiRequest } from '@/app/lib/api';
import Cookies from 'js-cookie';

interface MovieFormProps {
  initialData?: any;
  type: 'create' | 'edit';
}

export default function MovieForm({ initialData, type }: MovieFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phân biệt đường dẫn admin/super-admin
  const basePath = pathname.includes('/super-admin') ? '/super-admin/movie' : '/admin/movies';

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading('Đang ghi đè dữ liệu hệ thống...');

    const formData = new FormData(e.currentTarget);
    const movieData = Object.fromEntries(formData.entries());

    // Payload khớp 100% với JSON Backend yêu cầu (Có genreId)
    const payload = {
      title: String(movieData.title),
      description: String(movieData.description || ""),
      duration: Number(movieData.duration) || 0,
      director: String(movieData.director || ""),
      cast: String(movieData.cast || ""),
      country: String(movieData.country || ""),
      status: String(movieData.status),
      posterUrl: String(movieData.posterUrl || ""),
      trailerUrl: String(movieData.trailerUrl || ""),
      releaseDate: movieData.releaseDate,
      genreId: Number(movieData.genreId) || 0 // Ép kiểu số cho genreId
    };

    try {
      const isEdit = type === 'edit';
      const url = isEdit ? `/api/v1/movies/${initialData?.id}` : `/api/v1/movies`;
      const method = isEdit ? 'PUT' : 'POST';

      const token = localStorage.getItem("token") || Cookies.get("token");
console.log("Token xịn đây bà ơi:", token);
      const response = await apiRequest(url, { 
        method, 
        body: JSON.stringify(payload),
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Thao tác thành công!', { id: loadingToast });
        setTimeout(() => {
          router.push(basePath);
          router.refresh();
        }, 800);
      } else {
        const result = await response.json().catch(() => ({}));
        const msg = response.status === 403 
          ? "403: Không có quyền Admin hoặc Token lỗi!" 
          : (result.message || "Lỗi dữ liệu đầu vào!");
        toast.error(msg, { id: loadingToast });
      }
    } catch (error) {
      toast.error('Lỗi kết nối Server!', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Toaster position="top-right" />
      
      <button type="button" onClick={() => router.push(basePath)} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[9px] font-black uppercase tracking-[0.3em] mb-10 transition-all group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Quay lại quản lý phim
      </button>

      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-end gap-4 mb-4 font-[1000] italic uppercase text-white tracking-tighter leading-none">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20"><Film size={24} /></div>
            <h1 className="text-4xl">{type === 'edit' ? 'Sửa' : 'Tạo'} <span className="text-zinc-700 text-3xl font-black">Phim</span></h1>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-2xl backdrop-blur-md">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">Tên bộ phim</label>
              <input name="title" required defaultValue={initialData?.title} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:border-red-600" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">Mô tả</label>
              <textarea name="description" rows={4} defaultValue={initialData?.description} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:border-red-600 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1 flex items-center gap-1"><Clock size={12}/> Thời lượng</label>
                <input name="duration" type="number" required defaultValue={initialData?.duration} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1 flex items-center gap-1"><Calendar size={12}/> Khởi chiếu</label>
                <input name="releaseDate" type="date" required defaultValue={formatDateForInput(initialData?.releaseDate)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:border-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-xl">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-red-600 tracking-widest ml-1"><Tag size={12} className="inline mr-1"/> ID Thể loại</label>
              <input name="genreId" type="number" required defaultValue={initialData?.genre?.id} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:border-red-600" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">Trạng thái</label>
              <select name="status" defaultValue={initialData?.status || "NOW_SHOWING"} className="w-full bg-zinc-800 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none cursor-pointer">
                <option value="NOW_SHOWING">Đang chiếu</option>
                <option value="COMING_SOON">Sắp chiếu</option>
                <option value="END">Đã kết thúc</option>
              </select>
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1 text-[8px] opacity-50 italic">Poster / Trailer URL</label>
                <input name="posterUrl" defaultValue={initialData?.posterUrl} placeholder="Poster URL..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-[10px] text-zinc-400 outline-none mb-2" />
                <input name="trailerUrl" defaultValue={initialData?.trailerUrl} placeholder="Trailer URL..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-[10px] text-zinc-400 outline-none" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-white hover:bg-red-600 text-black hover:text-white py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16}/> Cập nhật hệ thống</>}
          </button>
        </div>
      </form>
    </div>
  );
}