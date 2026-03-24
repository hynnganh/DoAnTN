"use client";
import React, { useState, useEffect, use } from 'react';
import { 
  Play, Star, Heart, Share2, Flame, 
  ChevronRight, Award, Image as ImageIcon,
  Clock, Calendar, Globe, Film
} from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from "../../../lib/api";

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Giải nén params theo chuẩn Next.js 15
  const resolvedParams = use(params);
  const movieId = resolvedParams.id;

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await apiRequest(`/api/v1/movies/${movieId}`, { method: "GET" });
        if (response.ok) {
          const resData = await response.json();
          // Lưu ý: resData.data vì cấu trúc API của bạn thường bọc trong field data
          setMovie(resData.data || resData); 
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết phim:", error);
      } finally {
        setLoading(false);
      }
    };
    if (movieId) fetchMovieDetail();
  }, [movieId]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!movie) return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-black uppercase italic">Không tìm thấy phim</h2>
      <Link href="/" className="text-red-500 font-bold uppercase text-xs border-b border-red-500">Quay lại trang chủ</Link>
    </div>
  );

  // MAPPING DỮ LIỆU TỪ SQL ENTITY
  const displayTitle = movie.title || "Đang cập nhật";
  const displayPoster = movie.posterUrl || "https://placehold.co/400x600?text=No+Poster";
  const displayBackdrop = movie.posterUrl; // Vì SQL không có backdropUrl, dùng poster làm nền mờ
  const displayRating = movie.rating ? movie.rating.toFixed(1) : "NEW";
  const displayDuration = movie.duration ? `${movie.duration} PHÚT` : "N/A";
  const displayGenre = movie.genre?.name || "Hành động / Khoa học"; // Lấy từ Genre Object
  const displayReleaseDate = movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('vi-VN') : "Sắp chiếu";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600/30">
      
      {/* --- HERO BACKDROP SECTION --- */}
      <section className="relative h-[75vh] md:h-[90vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={displayBackdrop} 
            className="w-full h-full object-cover object-top opacity-30 blur-sm scale-110" 
            alt="backdrop" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20 z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center md:items-end">
            
            {/* Poster từ field posterUrl trong SQL */}
            <div className="hidden md:block w-72 lg:w-80 aspect-[2/3] rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)] border border-white/10 shrink-0">
              <img src={displayPoster} className="w-full h-full object-cover" alt={displayTitle} />
            </div>

            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
                <span className="bg-red-600 text-white font-black px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest shadow-lg">
                  {movie.status === "SHOWING" ? "ĐANG CHIẾU" : "SẮP CHIẾU"}
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white font-black px-4 py-1.5 rounded-xl text-[10px] border border-white/10 tracking-widest flex items-center gap-2">
                  <Clock size={12} /> {displayDuration}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-[1000] italic tracking-tighter uppercase leading-[0.9] drop-shadow-2xl">
                  {displayTitle}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-6 text-zinc-400">
                   <div className="flex items-center gap-2 text-yellow-500">
                      <Star size={24} fill="currentColor" />
                      <span className="text-3xl font-black">{displayRating}</span>
                   </div>
                   <div className="h-6 w-[1px] bg-white/20" />
                   <p className="text-sm font-black uppercase tracking-widest text-zinc-300">{displayGenre}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                <Link href={`${movieId}/booking/`} className="flex items-center gap-3 px-10 py-5 bg-red-600 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95 group">
                   ĐẶT VÉ NGAY <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="flex items-center gap-3 px-8 py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                  <Play size={20} fill="currentColor" /> TRAILER
                </button>
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-5 rounded-full border border-white/10 transition-all ${isLiked ? 'bg-red-600/20 border-red-600 text-red-600' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <main className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-3 gap-20">
        
        {/* Left: Thông tin chi tiết */}
        <div className="lg:col-span-2 space-y-20">
          
          <section className="space-y-8">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
              <div className="w-12 h-[2px] bg-red-600" /> NỘI DUNG PHIM
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed font-medium">
              {movie.description || "Chưa có mô tả chi tiết cho phim này."}
            </p>
          </section>

          {/* Thông số mapping từ Entity */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-y border-white/5">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] flex items-center gap-2">
                <Film size={12} /> Đạo diễn
              </span>
              <p className="text-xl font-bold uppercase italic tracking-tight">{movie.director || "Đang cập nhật"}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] flex items-center gap-2">
                <Award size={12} /> Diễn viên
              </span>
              <p className="text-xl font-bold uppercase italic tracking-tight leading-snug">{movie.cast || "Đang cập nhật"}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] flex items-center gap-2">
                <Globe size={12} /> Quốc gia
              </span>
              <p className="text-xl font-bold uppercase italic tracking-tight">{movie.country || "Đang cập nhật"}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] flex items-center gap-2">
                <Calendar size={12} /> Ngày công chiếu
              </span>
              <p className="text-xl font-bold uppercase italic tracking-tight">{displayReleaseDate}</p>
            </div>
          </section>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-10">
          <div className="bg-zinc-900/40 p-10 rounded-[3.5rem] border border-white/5 backdrop-blur-sm space-y-8">
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Định dạng hỗ trợ</h4>
               <div className="flex flex-wrap gap-2">
                 {["2D", "3D", "IMAX"].map(t => (
                   <span key={t} className="px-3 py-1 bg-black rounded-lg border border-white/5 text-[10px] font-bold tracking-tighter">{t}</span>
                 ))}
               </div>
            </div>
            
            <div className="pt-8 border-t border-white/5 space-y-6">
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-4 bg-white/5 text-zinc-400 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Share2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">Chia sẻ</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Gửi cho bạn bè</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Mini Poster Sidebar */}
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/5 group">
            <img src={displayPoster} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="sidebar-poster" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-8 left-0 right-0 text-center">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 text-red-500">A&K Cinema</p>
               <h5 className="text-xl font-black italic uppercase tracking-tighter px-4">{displayTitle}</h5>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}