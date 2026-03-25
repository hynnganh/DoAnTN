"use client";
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Save, Globe, Clock, Calendar, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface MovieFormProps {
  initialData?: any;
  type: 'create' | 'edit';
}

export default function MovieForm({ initialData, type }: MovieFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tự động xác định đường dẫn cha để điều hướng (superadmin hoặc admin)
  const basePath = pathname.includes('/super-admin') ? '/super-admin/movie' : '/admin/movies';

  // Fix lỗi input date không hiển thị giá trị mặc định (cần định dạng YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading('Đang xử lý dữ liệu...');

    // Thu thập data từ form
    const formData = new FormData(e.currentTarget);
    const movieData = Object.fromEntries(formData.entries());

    // Chuẩn hóa Payload gửi lên Spring Boot
    const payload = {
      ...movieData,
      duration: Number(movieData.duration),
      // Đảm bảo không gửi field rỗng nếu backend yêu cầu string
      description: movieData.description || "",
      director: movieData.director || "",
      country: movieData.country || "",
      posterUrl: movieData.posterUrl || "",
      trailerUrl: movieData.trailerUrl || "",
      // Map lại status nếu cần (ví dụ BE dùng Enum viết hoa)
      status: movieData.status 
    };

    try {
      const token = localStorage.getItem('token');
      const url = type === 'create' 
        ? `http://localhost:8080/api/v1/movies` 
        : `http://localhost:8080/api/v1/movies/${initialData?.id}`;
      
      const response = await fetch(url, {
        method: type === 'create' ? 'POST' : 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(type === 'create' ? 'Thêm phim mới thành công!' : 'Cập nhật phim thành công!', { id: loadingToast });
        
        // Đợi 1 chút để user thấy thông báo rồi mới cook
        setTimeout(() => {
          router.push(basePath);
          router.refresh();
        }, 800);
      } else {
        toast.error(result.message || 'Có lỗi xảy ra từ Server!', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Lỗi kết nối Server, vui lòng kiểm tra lại!', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <Toaster position="top-right" />

      {/* Nút quay lại dynamic */}
      <button 
        type="button"
        onClick={() => router.push(basePath)}
        className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Quay lại danh sách
      </button>

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter text-white">
          {type === 'create' ? 'Tạo ' : 'Sửa '}<span className="text-red-600">Phim</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[3rem] space-y-6 shadow-2xl backdrop-blur-md">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Tên bộ phim</label>
              <input name="title" required defaultValue={initialData?.title} placeholder="VD: Avatar: The Way of Water" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-red-600 transition-all focus:bg-white/[0.08]" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Mô tả chi tiết</label>
              <textarea name="description" rows={6} defaultValue={initialData?.description} placeholder="Nội dung tóm tắt..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-red-600 resize-none transition-all focus:bg-white/[0.08]" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 flex items-center gap-1">
                  <Clock size={10}/> Thời lượng (phút)
                </label>
                <input name="duration" type="number" required defaultValue={initialData?.duration} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-red-600" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 flex items-center gap-1">
                  <Calendar size={10}/> Ngày khởi chiếu
                </label>
                <input 
                  name="releaseDate" 
                  type="date" 
                  defaultValue={formatDateForInput(initialData?.releaseDate)} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-red-600" 
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[3rem] grid grid-cols-2 gap-6 shadow-2xl">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Đạo diễn</label>
                <input name="director" defaultValue={initialData?.director} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-red-600" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 flex items-center gap-1">
                  <Globe size={10}/> Quốc gia
                </label>
                <input name="country" defaultValue={initialData?.country} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-red-600" />
              </div>
          </div>
        </div>

        {/* Cột phải: Media & Trạng thái */}
        <div className="space-y-6">
          <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[3rem] space-y-6 shadow-2xl">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Trạng thái chiếu</label>
              <div className="relative">
                <select name="status" defaultValue={initialData?.status || "NOW_SHOWING"} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-red-600 appearance-none cursor-pointer">
                  <option value="NOW_SHOWING">Đang chiếu</option>
                  <option value="COMING_SOON">Sắp chiếu</option>
                  <option value="END">Đã kết thúc</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Poster URL</label>
              <input name="posterUrl" defaultValue={initialData?.posterUrl} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[10px] text-white outline-none focus:border-red-600" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Trailer URL (Youtube)</label>
              <input name="trailerUrl" defaultValue={initialData?.trailerUrl} placeholder="https://youtube.com/..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[10px] text-white outline-none focus:border-red-600" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-[2rem] font-[1000] italic uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-2xl shadow-red-600/20 active:scale-95 disabled:opacity-50 group"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={20} className="group-hover:rotate-12 transition-transform" />
                {type === 'create' ? 'Lưu phim mới' : 'Cập nhật phim'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}