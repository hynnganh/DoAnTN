"use client";
import React, { useState } from 'react';
import { 
  Play, Star, Clock, Calendar, 
  Info, Heart, Share2, Flame, Layers, 
  ChevronRight, Award, Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false);

  // Dữ liệu giả lập tập trung vào giới thiệu phim
  const movie = {
    id: params.id,
    title: "AVATAR: THE SEED BEARER",
    tag: "T16",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000",
    genre: "Hành động / Phiêu lưu / Sci-Fi",
    duration: "192 PHÚT",
    rating: 9.5,
    isImax: true,
    isHot: true,
    description: "Tiếp nối hành trình của Jake Sully và Neytiri, phần 3 đưa khán giả khám phá những vùng đất mới của Pandora, nơi họ phải đối mặt với những bộ tộc Na'vi hung dữ hơn và những hiểm họa tiềm tàng từ lòng đất. Cuộc chiến không chỉ dừng lại ở việc bảo vệ hành tinh, mà còn là bảo vệ gia đình và những giá trị cốt lõi của linh hồn Pandora.",
    director: "James Cameron",
    cast: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
    releaseDate: "20/03/2026",
    production: "20th Century Studios",
    language: "Tiếng Anh (Phụ đề Tiếng Việt)"
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600/30">
      
      {/* --- HERO BACKDROP SECTION --- */}
      <section className="relative h-[70vh] md:h-[90vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={movie.backdrop} 
            className="w-full h-full object-cover object-top opacity-50 md:opacity-100" 
            alt="backdrop" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent hidden md:block" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20 z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-end">
            
            <div className="hidden md:block w-80 aspect-[2/3] rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10">
              <img src={movie.image} className="w-full h-full object-cover" alt="poster" />
            </div>

            <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <div className="flex flex-wrap gap-3 items-center">
                <span className="bg-red-600 text-white font-black px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest shadow-lg">
                  {movie.tag}
                </span>
                {movie.isImax && (
                  <span className="bg-blue-600/60 backdrop-blur-md text-white font-black px-4 py-1.5 rounded-xl text-[10px] border border-blue-400/30 italic tracking-widest uppercase">
                    IMAX
                  </span>
                )}
                {movie.isHot && (
                  <span className="bg-orange-600 text-white font-black px-4 py-1.5 rounded-xl text-[10px] flex items-center gap-1 uppercase tracking-widest">
                    <Flame size={12} fill="currentColor" /> HOT
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-8xl font-[1000] italic tracking-tighter uppercase leading-[0.85]">
                  {movie.title}
                </h1>
                <div className="flex items-center gap-6 text-zinc-400">
                   <div className="flex items-center gap-2 text-yellow-500">
                      <Star size={20} fill="currentColor" />
                      <span className="text-2xl font-black">{movie.rating}</span>
                   </div>
                   <div className="h-4 w-[1px] bg-white/20" />
                   <p className="text-sm font-black uppercase tracking-widest">{movie.genre}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                {/* Nút chính dẫn tới trang booking */}
                {/* <Link href={`/movies/${params.id}/booking`} className="flex items-center gap-3 px-10 py-5 bg-red-600 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95 group">
                   ĐẶT VÉ NGAY <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link> */}
                <Link href={`/movies/2/booking`} className="flex items-center gap-3 px-10 py-5 bg-red-600 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95 group">
                   ĐẶT VÉ NGAY <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="flex items-center gap-3 px-8 py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                  <Play size={20} fill="currentColor" /> XEM TRAILER
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
        
        {/* Left: Deep Info */}
        <div className="lg:col-span-2 space-y-20">
          
          {/* Cốt truyện */}
          <section className="space-y-8">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
              <div className="w-12 h-[2px] bg-red-600" /> CỐT TRUYỆN
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed font-medium max-w-3xl">
              {movie.description}
            </p>
          </section>

          {/* Thông số kỹ thuật */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-y border-white/5">
            <div className="space-y-3">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Đạo diễn</span>
              <p className="text-xl font-bold uppercase italic tracking-tight">{movie.director}</p>
            </div>
            <div className="space-y-3">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Diễn viên</span>
              <p className="text-xl font-bold uppercase italic tracking-tight leading-snug">{movie.cast}</p>
            </div>
            <div className="space-y-3">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Sản xuất</span>
              <p className="text-xl font-bold uppercase italic tracking-tight">{movie.production}</p>
            </div>
            <div className="space-y-3">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Ngôn ngữ</span>
              <p className="text-xl font-bold uppercase italic tracking-tight">{movie.language}</p>
            </div>
          </section>

          {/* Thư viện ảnh (Vừa thêm) */}
          <section className="space-y-8">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
              <ImageIcon className="text-red-600" /> THƯ VIỆN HÌNH ẢNH
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/5">
                 <img src="https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=1000" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="gallery" />
              </div>
              <div className="aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/5">
                 <img src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="gallery" />
              </div>
            </div>
          </section>
        </div>

        {/* Right: Sidebar Awards & Share */}
        <div className="space-y-12">
          {/* Awards/Tag Section */}
          <div className="bg-zinc-900/30 p-10 rounded-[3rem] border border-white/5 space-y-8">
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Định dạng hỗ trợ</h4>
               <div className="flex flex-wrap gap-2">
                 {["2D", "3D", "IMAX", "4DX"].map(t => (
                   <span key={t} className="px-3 py-1 bg-black rounded-lg border border-white/5 text-[10px] font-bold">{t}</span>
                 ))}
               </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 space-y-6">
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-3 bg-red-600/10 text-red-600 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Share2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">Chia sẻ</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Gửi cho bạn bè</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-2xl group-hover:bg-yellow-500 group-hover:text-black transition-all">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">Phim tiêu điểm</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Lựa chọn của A&K</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Banner quảng cáo nhỏ hoặc Thông tin phát hành */}
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/5">
            <img src={movie.image} className="w-full h-full object-cover" alt="mini-poster" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-center">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 text-red-500">Khởi chiếu</p>
               <h5 className="text-xl font-black italic uppercase tracking-tighter">{movie.releaseDate}</h5>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}