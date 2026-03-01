import React from 'react';
import { Ticket, Play, Star, Info, Bell, Calendar, Flame } from 'lucide-react';
import Link from 'next/link';
// Định nghĩa kiểu dữ liệu đồng nhất
export interface Movie {
  id: number;
  title: string;
  tag: string;
  image: string;
  genre: string;
  duration: string;
  rating?: number | null;
  rank?: number | null;
  isImax?: boolean;
  isHot?: boolean;
  releaseDate?: string; // Chỉ dùng cho sắp chiếu
}

interface MovieCardProps {
  movie: Movie;
  type: 'showing' | 'upcoming';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, type }) => {
  const isShowing = type === 'showing';
  const themeColor = isShowing ? 'red' : 'blue';

  return (
    <div className="group relative flex flex-col">
      {/* Poster Card */}
      <div className={`relative aspect-[2/3] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl transition-all duration-700 bg-[#111]
        ${isShowing ? 'hover:border-red-600/40' : 'hover:border-blue-500/40'} hover:-translate-y-6`}>
        
        <img 
          src={movie.image} 
          alt={movie.title} 
          className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 
            ${!isShowing && 'grayscale-[0.6] group-hover:grayscale-0'}`}
        />

        {/* Badges (Top Left) */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
          <span className="bg-black/40 backdrop-blur-md text-white font-black px-3 py-1.5 rounded-xl text-[10px] border border-white/10 uppercase tracking-widest shadow-xl">
            {movie.tag}
          </span>
          {movie.isImax && (
            <span className="bg-blue-600/60 backdrop-blur-md text-white font-black px-3 py-1.5 rounded-xl text-[10px] border border-blue-400/30 italic tracking-widest">
              IMAX
            </span>
          )}
        </div>

        {/* Rating/Hot Badge (Top Right) */}
        <div className="absolute top-6 right-6 z-20">
          {isShowing && movie.rating ? (
            <div className="bg-yellow-500 text-black font-black px-3 py-2 rounded-2xl flex items-center gap-1.5 text-xs shadow-2xl">
              <Star size={14} fill="currentColor" /> {movie.rating}
            </div>
          ) : movie.isHot ? (
            <div className="bg-red-600 text-white font-black px-3 py-1.5 rounded-xl text-[10px] shadow-lg animate-pulse flex items-center gap-1">
              <Flame size={12} fill="currentColor" /> HOT
            </div>
          ) : null}
        </div>

        {/* Rank (Chỉ hiện khi Đang chiếu) */}
        {isShowing && movie.rank && (
          <div className="absolute -bottom-6 -left-4 text-[14rem] font-black leading-none italic pointer-events-none transition-all duration-700 text-white/5 group-hover:text-red-600/10 custom-shadow-rank">
            {movie.rank}
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 gap-4 z-30">
          <button className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all transform translate-y-8 group-hover:translate-y-0 duration-500
            ${isShowing ? 'bg-red-600 text-white hover:bg-white hover:text-black' : 'bg-white text-black hover:bg-blue-600 hover:text-white'}`}>
            <Play size={16} fill="currentColor" /> {isShowing ? 'Trailer' : 'Xem Trailer'}
          </button>
          <Link 
            href={`/movies/${movie.id}`} 
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white/20 transition-all transform translate-y-8 group-hover:translate-y-0 duration-700"
          >
            <Info size={16} /> Chi Tiết
          </Link>
        </div>
      </div>

      {/* Movie Info */}
      <div className="mt-10 space-y-4 px-4">
        <div className="flex items-center justify-between gap-2">
          <div className={`flex items-center gap-2 ${!isShowing && 'text-blue-400'}`}>
            {!isShowing && <Calendar size={14} />}
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">
              {isShowing ? movie.genre : movie.releaseDate}
            </span>
          </div>
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            {movie.duration}
          </span>
        </div>
        
        <Link href={`/movies/${movie.id}`}>
          <h3 className={`text-2xl font-black uppercase tracking-tighter transition-colors leading-[1.1] min-h-[3.5rem] line-clamp-2 cursor-pointer
            ${isShowing ? 'group-hover:text-red-500' : 'group-hover:text-blue-500'}`}>
            {movie.title}
          </h3>
        </Link>

        <div className="pt-2">
          <button className={`w-full relative py-4 bg-white/5 rounded-2xl overflow-hidden transition-all duration-500 border border-white/10 active:scale-95 group/btn shadow-2xl
            ${isShowing ? 'hover:bg-red-600 hover:border-red-600' : 'hover:bg-blue-600 hover:border-blue-600'}`}>
            <span className="relative z-10 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] transition-colors">
              {isShowing ? 'MUA VÉ NGAY' : 'NHẬN THÔNG BÁO'} 
              {isShowing ? <Ticket size={18} /> : <Bell size={18} />}
            </span>
            <div className={`absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full skew-x-12
              ${isShowing ? 'group-hover/btn:animate-shimmer-red' : 'group-hover/btn:animate-shimmer-blue'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;