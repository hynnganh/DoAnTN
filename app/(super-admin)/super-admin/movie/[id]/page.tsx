"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Edit3, Trash2, Globe, Star, PlayCircle, 
  Clock, User, Tag, Loader2, Calendar, Hash
} from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/app/lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function CompactAdminMovieDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiRequest(`/api/v1/movies/${id}`);
        const resData = await res.json();
        if (res.ok) setMovie(resData.data);
      } catch (error) {
        toast.error("Lỗi kết nối hệ thống!");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="h-[50vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-red-500" size={32} />
    </div>
  );

  if (!movie) return <div className="text-zinc-500 text-center p-10 text-xs uppercase font-black">Không tìm thấy dữ liệu</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4 animate-in fade-in duration-500">
      <Toaster position="top-right" />

      {/* Top Bar - Nhỏ gọn */}
      <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-xl transition-all">
            <ArrowLeft size={16} className="text-zinc-400" />
          </button>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-white leading-none">Chi tiết phim</h1>
            <p className="text-[10px] text-zinc-500 mt-1">ID: #{movie.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/super-admin/movie/edit/${id}`} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/10 flex items-center gap-2">
            <Edit3 size={14} /> Sửa
          </Link>
          <button className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-red-500/20 transition-all">
            Xóa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Cột trái - Poster nhỏ */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-lg">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} className="w-full h-full object-cover" />
            ) : <div className="w-full h-full flex items-center justify-center text-zinc-800"><Hash size={32}/></div>}
          </div>
          
          <div className="bg-zinc-900/30 border border-white/5 p-4 rounded-2xl">
            <p className="text-[9px] font-black text-zinc-500 uppercase mb-3">Trạng thái</p>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${movie.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {movie.status}
              </span>
              <span className="text-[10px] font-bold text-zinc-300 italic">{movie.rating} ★</span>
            </div>
          </div>
        </div>

        {/* Cột phải - Thông tin chi tiết thu gọn */}
        <div className="col-span-12 md:col-span-9 space-y-4">
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
            <div className="mb-6">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{movie.genre?.name || 'N/A'}</span>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mt-1">{movie.title}</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <SmallInfo icon={<Clock size={14}/>} label="Thời lượng" value={`${movie.duration}m`} />
              <SmallInfo icon={<User size={14}/>} label="Đạo diễn" value={movie.director} />
              <SmallInfo icon={<Calendar size={14}/>} label="Phát hành" value={movie.releaseDate} />
              <SmallInfo icon={<Globe size={14}/>} label="Quốc gia" value={movie.country} />
              <SmallInfo icon={<Star size={14}/>} label="Đánh giá" value={`${movie.rating}/10`} />
              <SmallInfo icon={<Tag size={14}/>} label="Thể loại" value={movie.genre?.name} />
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[9px] font-black text-zinc-500 uppercase mb-2">Diễn viên</p>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-medium">{movie.cast || 'N/A'}</p>
            </div>

            <div className="mt-6">
              <p className="text-[9px] font-black text-zinc-500 uppercase mb-2">Tóm tắt cốt truyện</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed italic bg-white/5 p-4 rounded-xl border border-white/5">
                {movie.description || "Chưa có mô tả."}
              </p>
            </div>
            
            {movie.trailerUrl && (
              <div className="mt-6 flex items-center justify-between p-3 bg-red-600/5 rounded-xl border border-red-600/10">
                <div className="flex items-center gap-3">
                  <PlayCircle size={18} className="text-red-500" />
                  <span className="text-[10px] font-bold text-zinc-300">Trailer URL:</span>
                  <span className="text-[10px] text-zinc-500 truncate max-w-[200px]">{movie.trailerUrl}</span>
                </div>
                <a href={movie.trailerUrl} target="_blank" className="text-[9px] font-black text-red-500 uppercase hover:underline">Mở link</a>
              </div>
            )}
          </div>
          
          {/* Audit Logs thu nhỏ */}
          <div className="flex gap-4">
            <div className="flex-1 bg-zinc-900/20 border border-white/5 p-3 rounded-xl flex justify-between items-center px-4">
               <span className="text-[9px] font-black text-zinc-600 uppercase">Ngày tạo</span>
               <span className="text-[10px] text-zinc-400">{new Date(movie.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex-1 bg-zinc-900/20 border border-white/5 p-3 rounded-xl flex justify-between items-center px-4">
               <span className="text-[9px] font-black text-zinc-600 uppercase">Cập nhật</span>
               <span className="text-[10px] text-zinc-400">{new Date(movie.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmallInfo({ icon, label, value }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-[11px] text-white font-bold uppercase truncate">{value || 'N/A'}</p>
    </div>
  );
}