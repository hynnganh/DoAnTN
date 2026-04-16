"use client";
import React, { useState, useEffect, use } from 'react';
import { 
  Play, Star, Heart, Share2, 
  ChevronRight, Award, 
  Clock, Calendar, Globe, Film, Ticket
} from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from "@/app/lib/api";

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
          setMovie(resData.data || resData); 
        }
      } catch (error) { console.error("Lỗi:", error); } 
      finally { setLoading(false); }
    };
    if (movieId) fetchMovieDetail();
  }, [movieId]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!movie) return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4">
      <h2 className="text-lg font-black uppercase italic tracking-tighter">Không tìm thấy phim</h2>
      <Link href="/" className="text-[10px] text-zinc-500 font-black uppercase tracking-widest border-b border-zinc-800 pb-1">Quay lại trang chủ</Link>
    </div>
  );

  const displayTitle = movie.title || "Đang cập nhật";
  const displayPoster = movie.posterUrl || "https://placehold.co/400x600?text=No+Poster";
  const displayRating = movie.rating ? movie.rating.toFixed(1) : "NEW";
  const displayDuration = movie.duration ? `${movie.duration} PHÚT` : "N/A";
  const displayGenre = movie.genre?.name || "HÀNH ĐỘNG";
const getLocalImagePath = (fileName: string) => {

    if (!fileName) return "https://placehold.co/400x600?text=No+Poster";

    if (fileName.startsWith("http")) return fileName; 

    

    return `/images/${fileName}`; 

  };
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-red-600/30">
      
      {/* --- PHẦN ĐẦU TRANG (THU GỌN LẠI) --- */}
      <section className="relative h-[50vh] md:h-[55vh] w-full overflow-hidden">
        <div className="absolute inset-0">
        <img 
            src={displayPoster} 
            className="w-full h-full object-cover opacity-10 blur-3xl scale-110" 
            alt="bg"
            onError={(e) => e.currentTarget.src = "https://placehold.co/400x600?text=Error"} 
          />          
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-center pt-10">
          <div className="max-w-5xl mx-auto px-6 w-full flex flex-col md:flex-row gap-8 items-center md:items-end pb-8">
            
            {/* Poster nhỏ nhắn, tinh tế */}
            <div className="w-36 md:w-48 aspect-[2/3] rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/5 shrink-0 animate-in fade-in zoom-in duration-700">
              <img src={displayPoster} className="w-full h-full object-cover" alt={displayTitle} />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 items-center">
                <span className="bg-red-600 text-white font-black px-2 py-1 rounded-md text-[8px] uppercase tracking-widest">
                  {movie.status === "SHOWING" ? "ĐANG CHIẾU" : "SẮP CHIẾU"}
                </span>
                <span className="bg-white/5 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border border-white/10 text-zinc-500">
                   {displayDuration}
                </span>
              </div>

              {/* Tiêu đề nhỏ lại một chút để thanh thoát */}
              <div className="space-y-1">
                <h1 className="text-3xl md:text-5xl font-[1000] italic tracking-tighter uppercase leading-none text-white drop-shadow-lg">
                  {displayTitle}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-3">
                   <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-lg font-black italic">{displayRating}</span>
                   </div>
                   <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">{displayGenre}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                {movie.status === "SHOWING" ? (
                  <Link 
                    href={`${movieId}/booking/`} 
                    className="flex items-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-red-600/20 active:scale-95 group"
                  >
                    <Ticket size={14} /> ĐẶT VÉ NGAY
                  </Link>
                ) : (
                  <div className="px-6 py-3.5 bg-zinc-900 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600">
                    CHƯA MỞ BÁN VÉ
                  </div>
                )}
                <button className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                  <Play size={16} fill="currentColor" />
                </button>
                <button onClick={() => setIsLiked(!isLiked)} className={`p-3.5 rounded-xl border transition-all ${isLiked ? 'bg-red-600/20 border-red-600 text-red-600' : 'bg-white/5 border-white/10'}`}>
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NỘI DUNG CHI TIẾT (TO RÕ HƠN) --- */}
      <main className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Cột trái: Tóm tắt to rõ */}
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 italic flex items-center gap-3">
              <span className="w-6 h-[2px] bg-red-600" /> NỘI DUNG PHIM
            </h3>
            {/* Tăng size nội dung bên trong */}
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-medium italic bg-zinc-900/10 p-6 rounded-[2rem] border border-white/5">
              {movie.description || "Chưa có mô tả chi tiết cho bộ phim này."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-zinc-900/20 rounded-[2rem] border border-white/5">
            <InfoBox icon={<Film size={12}/>} label="ĐẠO DIỄN" value={movie.director} />
            <InfoBox icon={<Award size={12}/>} label="QUỐC GIA" value={movie.country} />
            <InfoBox icon={<Globe size={12}/>} label="NĂM" value={movie.releaseDate ? new Date(movie.releaseDate).getFullYear().toString() : "N/A"} />
            <InfoBox icon={<Calendar size={12}/>} label="THỂ LOẠI" value={movie.genre?.name} />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">DÀN DIỄN VIÊN</h3>
            <p className="text-sm font-bold text-zinc-300 leading-snug uppercase tracking-tight italic">
              {movie.cast || "ĐANG CẬP NHẬT..."}
            </p>
          </div>
        </div>

        {/* Cột phải: Sidebar gọn gàng */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-7 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] space-y-6">
              <div className="space-y-3 text-center border-b border-white/5 pb-6">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-red-600">A&K CINEMA</p>
                <p className="text-[10px] text-zinc-500 font-medium italic leading-relaxed">Trải nghiệm điện ảnh đỉnh cao với âm thanh sống động.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-black uppercase text-zinc-600">ĐỊNH DẠNG</span>
                  <span className="font-black text-white bg-white/5 px-2 py-0.5 rounded tracking-tighter">2D / IMAX</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-black uppercase text-zinc-600">NGÔN NGỮ</span>
                  <span className="font-black text-white">PHỤ ĐỀ VN</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-black uppercase text-zinc-600">CHIA SẺ</span>
                  <Share2 size={12} className="text-zinc-500 cursor-pointer hover:text-red-600 transition-colors" />
                </div>
              </div>

              <button className="w-full py-3 bg-white text-black rounded-xl text-[9px] font-[1000] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                ĐÁNH GIÁ NGAY
              </button>
           </div>
        </div>
      </main>
    </div>
  );
}

function InfoBox({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-red-600 mb-1">{icon}</div>
      <p className="text-[7px] font-black uppercase text-zinc-600 tracking-wider">{label}</p>
      <p className="text-[11px] font-bold text-white uppercase truncate italic">{value || "N/A"}</p>
    </div>
  );
}