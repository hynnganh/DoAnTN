"use client";
import React, { useState, useEffect } from 'react';
import MovieCard from '../MovieCard'; 
import { apiRequest } from "../../../lib/api";

export default function PhimDangChieu() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Lấy danh sách phim đang chiếu (SHOWING)
        const response = await apiRequest("/api/v1/movies?status=SHOWING", { 
          method: "GET" 
        });
        
        if (response.ok) {
          const resData = await response.json();
          // Backend trả về cấu trúc Page của Spring Boot (resData.data.content)
          setMovies(resData.data.content || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen pt-5 pb-20 px-6 md:px-16 text-white font-sans">
      {/* Inject CSS Animation đồng bộ với MovieCard */}
      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-150%) skewX(-12deg); } 100% { transform: translateX(150%) skewX(-12deg); } }
        .animate-shimmer { animation: shimmer 2.5s infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      {/* --- HEADER --- */}
      <div className="max-w-[1440px] mx-auto mb-5 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600 font-black tracking-[0.4em] text-[10px] uppercase">
            <span className="w-16 h-[2px] bg-red-600"></span>
            A&K Cinema Now Showing
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none italic">
            PHIM <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
              ĐANG CHIẾU
            </span>
          </h1>
        </div>
        
        <div className="max-w-xs text-gray-500 text-sm font-bold leading-relaxed border-l-2 border-red-600 pl-6 mb-2">
            Trải nghiệm điện ảnh đỉnh cao với những siêu phẩm mới nhất. Đặt vé ngay để nhận vị trí ngồi đẹp nhất tại hệ thống A&K!
        </div>
      </div>

      {/* --- HIỂN THỊ LOADING SKELETON --- */}
      {loading ? (
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="aspect-[2/3] w-full bg-zinc-900 animate-pulse rounded-[2.5rem]" />
              <div className="h-6 w-3/4 bg-zinc-900 animate-pulse rounded-lg" />
              <div className="h-4 w-1/2 bg-zinc-900 animate-pulse rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        /* --- GRID HIỂN THỊ PHIM --- */
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                id={movie.id}
                title={movie.title}
                // Đồng bộ tên field image với posterUrl từ Backend
                image={movie.posterUrl} 
                rating={movie.rating}
                status={movie.status}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-32 border border-dashed border-white/10 rounded-[3rem]">
              <p className="text-zinc-600 font-black uppercase tracking-[0.3em] italic text-xl">
                Hệ thống đang cập nhật danh sách phim...
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- FOOTER DECORATION --- */}
      <div className="mt-32 text-center border-t border-white/5 pt-20">
        <p className="text-gray-600 font-bold tracking-widest text-xs uppercase mb-6">Hết danh sách phim đang chiếu</p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-12 py-5 border border-white/10 rounded-full font-black text-[10px] tracking-[0.4em] uppercase text-gray-400 hover:text-white hover:border-red-600 transition-all active:scale-95 shadow-2xl"
        >
          Quay lại đầu trang
        </button>
      </div>
    </div>
  );
}