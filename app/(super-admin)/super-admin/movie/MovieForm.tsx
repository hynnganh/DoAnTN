"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ArrowLeft, Save, Clock, Calendar, 
  Loader2, Tag, Film, User, Globe, 
  Star, Image as ImageIcon, PlayCircle 
} from 'lucide-react';
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
  const [genres, setGenres] = useState<any[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  
  // State để preview ảnh poster ngay lập tức
  const [posterPreview, setPosterPreview] = useState(initialData?.posterUrl || "");
  // State quản lý trạng thái phim (Showing/Coming Soon)
  const [currentStatus, setCurrentStatus] = useState(initialData?.status || 'SHOWING');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await apiRequest('/api/v1/genres');
        const resData = await res.json();
        setGenres(resData.data || resData);
      } catch (error) {
        toast.error("Không thể tải danh sách thể loại!");
      } finally {
        setLoadingGenres(false);
      }
    };
    fetchGenres();
  }, []);

  const basePath = pathname.includes('/super-admin') ? '/super-admin/movie' : '/admin/movies';

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(type === 'create' ? 'Đ đang tạo phim mới...' : 'Đang cập nhật...');

    const formData = new FormData(e.currentTarget);
    const movieData = Object.fromEntries(formData.entries());

    const payload = {
      title: String(movieData.title),
      description: String(movieData.description || ""),
      duration: Number(movieData.duration) || 0,
      director: String(movieData.director || ""),
      cast: String(movieData.cast || ""),
      country: String(movieData.country || ""),
      rating: Number(movieData.rating) || 0,
      status: String(movieData.status), // Lấy từ Radio Group
      posterUrl: String(movieData.posterUrl || ""),
      trailerUrl: String(movieData.trailerUrl || ""),
      releaseDate: movieData.releaseDate,
      genreId: Number(movieData.genreId)
    };

    try {
      const isEdit = type === 'edit';
      const url = isEdit ? `/api/v1/movies/${initialData?.id}` : `/api/v1/movies`;
      const method = isEdit ? 'PUT' : 'POST';
      const token = localStorage.getItem("token") || Cookies.get("token");
      
      const response = await apiRequest(url, { 
        method, 
        body: JSON.stringify(payload),
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success(isEdit ? 'Cập nhật thành công!' : 'Tạo phim mới thành công!', { id: loadingToast });
        setTimeout(() => {
          router.push(basePath);
          router.refresh();
        }, 1000);
      } else {
        const result = await response.json().catch(() => ({}));
        toast.error(result.message || "Lỗi xử lý yêu cầu!", { id: loadingToast });
      }
    } catch (error) {
      toast.error('Lỗi kết nối Server!', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Toaster position="top-right" />
      
      <button 
        type="button" 
        onClick={() => router.push(basePath)} 
        className="flex items-center gap-2 text-zinc-500 hover:text-white text-[9px] font-black uppercase tracking-[0.3em] mb-10 transition-all group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Quay lại danh sách
      </button>

      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
        {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-end gap-4 mb-4 font-[1000] italic uppercase text-white tracking-tighter leading-none">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
              <Film size={24} />
            </div>
            <h1 className="text-4xl">
              {type === 'edit' ? 'Hiệu chỉnh' : 'Thêm mới'} 
              <span className="text-zinc-700 text-3xl font-black ml-3">Phim</span>
            </h1>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-2xl backdrop-blur-md">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">Tên bộ phim</label>
              <input 
                name="title" 
                required 
                defaultValue={initialData?.title} 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:border-red-600 transition-all" 
                placeholder="Nhập tên phim..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">Mô tả cốt truyện</label>
              <textarea 
                name="description" 
                rows={5} 
                defaultValue={initialData?.description} 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:border-red-600 resize-none transition-all" 
                placeholder="Nội dung chính của phim..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1 flex items-center gap-1"><User size={12}/> Đạo diễn</label>
                <input name="director" defaultValue={initialData?.director} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:border-red-600" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1 flex items-center gap-1"><Star size={12}/> Điểm đánh giá</label>
                <input name="rating" type="number" step="0.1" max="10" defaultValue={initialData?.rating} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:border-red-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">Dàn diễn viên (Cast)</label>
              <input name="cast" defaultValue={initialData?.cast} placeholder="Nguyễn Văn A, Trần Thị B..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:border-red-600" />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1 flex items-center gap-1"><Globe size={12}/> Quốc gia</label>
              <input name="country" defaultValue={initialData?.country} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:border-red-600" />
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: TRẠNG THÁI & MEDIA */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-xl backdrop-blur-md">
            
            {/* TRẠNG THÁI PHIM */}
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1 flex items-center gap-2">
                Trạng thái hiển thị
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`
                  flex flex-col items-center justify-center p-4 rounded-2xl border cursor-pointer transition-all
                  ${currentStatus === 'SHOWING' ? 'bg-red-600/10 border-red-600/50 text-red-500' : 'bg-white/5 border-white/10 text-zinc-700 hover:border-white/20'}
                `}>
                  <input 
                    type="radio" name="status" value="SHOWING" 
                    checked={currentStatus === 'SHOWING'}
                    onChange={() => setCurrentStatus('SHOWING')} 
                    className="hidden" 
                  />
                  <span className="text-[10px] font-black uppercase italic tracking-tighter">Showing</span>
                  <span className="text-[7px] font-bold uppercase opacity-40">Đang chiếu</span>
                </label>

                <label className={`
                  flex flex-col items-center justify-center p-4 rounded-2xl border cursor-pointer transition-all
                  ${currentStatus === 'COMING_SOON' ? 'bg-amber-600/10 border-amber-600/50 text-amber-500' : 'bg-white/5 border-white/10 text-zinc-700 hover:border-white/20'}
                `}>
                  <input 
                    type="radio" name="status" value="COMING_SOON" 
                    checked={currentStatus === 'COMING_SOON'}
                    onChange={() => setCurrentStatus('COMING_SOON')} 
                    className="hidden" 
                  />
                  <span className="text-[10px] font-black uppercase italic tracking-tighter">Coming Soon</span>
                  <span className="text-[7px] font-bold uppercase opacity-40">Sắp chiếu</span>
                </label>
              </div>
            </div>

            {/* POSTER PREVIEW */}
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">Poster Preview</label>
              <div className="relative aspect-[2/3] w-full bg-black/40 border border-dashed border-white/10 rounded-[1.5rem] overflow-hidden group flex items-center justify-center">
                {posterPreview ? (
                  <img 
                    src={posterPreview} 
                    alt="Poster" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() => { setPosterPreview(""); }}
                  />
                ) : (
                  <div className="text-center space-y-2 opacity-10">
                    <ImageIcon size={48} className="mx-auto" />
                    <p className="text-[8px] font-bold">No Image Found</p>
                  </div>
                )}
              </div>
            </div>

            {/* MEDIA LINKS */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest ml-1 italic">Media URLs</label>
                    <div className="relative">
                      <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
                      <input 
                        name="posterUrl" 
                        defaultValue={initialData?.posterUrl} 
                        onChange={(e) => setPosterPreview(e.target.value)}
                        placeholder="Link ảnh poster..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-5 text-[10px] text-zinc-400 outline-none focus:border-red-600" 
                      />
                    </div>
                    <div className="relative">
                      <PlayCircle size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
                      <input 
                        name="trailerUrl" 
                        defaultValue={initialData?.trailerUrl} 
                        placeholder="Link Youtube Trailer..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-5 text-[10px] text-zinc-400 outline-none focus:border-red-600" 
                      />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-red-600 tracking-widest ml-1 flex items-center gap-1"><Tag size={12}/> Thể loại</label>
                    <select name="genreId" required defaultValue={initialData?.genre?.id} className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none cursor-pointer focus:border-red-600 appearance-none">
                        <option value="">-- Chọn thể loại --</option>
                        {genres.map((g: any) => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1 flex items-center gap-1"><Clock size={12}/> Thời lượng (Phút)</label>
                    <input name="duration" type="number" required defaultValue={initialData?.duration} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:border-red-600" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1 flex items-center gap-1"><Calendar size={12}/> Ngày khởi chiếu</label>
                    <input name="releaseDate" type="date" required defaultValue={formatDateForInput(initialData?.releaseDate)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:border-red-600" />
                  </div>
                </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || loadingGenres} 
            className="w-full bg-white hover:bg-red-600 text-black hover:text-white py-5 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-red-600/10"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16}/> {type === 'create' ? 'Tạo phim ngay' : 'Lưu thay đổi'}</>}
          </button>
        </div>
      </form>
    </div>
  );
}