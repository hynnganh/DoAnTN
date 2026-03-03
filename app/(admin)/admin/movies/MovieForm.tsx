"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Film, Globe, Clock, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface MovieFormProps {
  initialData?: any;
  type: 'create' | 'edit';
}

export default function MovieForm({ initialData, type }: MovieFormProps) {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading('Đang xử lý dữ liệu...');

    try {
      // Giả lập gọi API (Sau này thay bằng fetch)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Thành công
      toast.success(
        type === 'create' ? 'Thêm phim mới thành công!' : 'Cập nhật phim thành công!',
        { id: loadingToast }
      );

      // Đợi một chút để user kịp nhìn thấy thông báo thành công trước khi chuyển trang
      setTimeout(() => {
        router.push('/admin/movies');
        router.refresh();
      }, 800);
      
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!', { id: loadingToast });
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
      {/* 1. Phải có Toaster ở đây hoặc ở Layout tổng để thông báo hiện lên */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Nút quay lại */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Quay lại danh sách
      </button>

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter text-white">
          {type === 'create' ? 'Tạo Phim Mới' : 'Chỉnh Sửa Phim'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        {/* Cột trái: Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[3rem] space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Tên bộ phim</label>
              <input name="title" required defaultValue={initialData?.title} placeholder="VD: Avatar: The Way of Water" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-red-600 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Mô tả chi tiết</label>
              <textarea name="description" rows={6} defaultValue={initialData?.description} placeholder="Nội dung tóm tắt của phim..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-red-600 resize-none transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 flex items-center gap-1">
                  <Clock size={10}/> Thời lượng (phút)
                </label>
                <input name="duration" type="number" defaultValue={initialData?.duration} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-red-600" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 flex items-center gap-1">
                  <Calendar size={10}/> Ngày khởi chiếu
                </label>
                <input name="release_date" type="date" defaultValue={initialData?.release_date} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[3rem] grid grid-cols-2 gap-6">
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
          <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[3rem] space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Trạng thái chiếu</label>
              <select name="status" defaultValue={initialData?.status} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-red-600 appearance-none cursor-pointer">
                <option value="Now Showing" className="bg-zinc-900">Đang chiếu</option>
                <option value="Coming Soon" className="bg-zinc-900">Sắp chiếu</option>
                <option value="End" className="bg-zinc-900">Đã kết thúc</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Poster URL</label>
              <input name="poster_url" defaultValue={initialData?.poster_url} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[10px] text-white outline-none focus:border-red-600" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Trailer URL (Youtube)</label>
              <input name="trailer_url" defaultValue={initialData?.trailer_url} placeholder="https://youtube.com/..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[10px] text-white outline-none focus:border-red-600" />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-[2rem] font-[1000] italic uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-2xl shadow-red-600/20 active:scale-95 hover:gap-5"
          >
            <Save size={20} />
            {type === 'create' ? 'Lưu phim mới' : 'Cập nhật phim'}
          </button>
        </div>
      </form>
    </div>
  );
}