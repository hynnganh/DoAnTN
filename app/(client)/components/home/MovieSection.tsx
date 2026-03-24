"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import MovieCard from "./MovieCard";
import { ChevronRight } from "lucide-react";
import { apiRequest } from "../../../lib/api";

export default function MovieSection() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowingMovies = async () => {
      try {
        // FIX 1: Đổi size=8 thành size=4 để chỉ hiện đúng 1 hàng trên Desktop
        const response = await apiRequest("/api/v1/movies?status=SHOWING&page=0&size=4", { 
          method: "GET" 
        });
        
        if (response.ok) {
          const resData = await response.json();
          setMovies(resData.data.content || []);
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowingMovies();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12 py-20 bg-[#0f0f0f]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[400px] bg-zinc-800/30 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <section className="px-6 md:px-12 py-20 bg-[#0f0f0f]">
      <div className="flex items-end justify-between mb-12">
        <div className="flex items-center gap-5">
          <div className="w-1.5 h-12 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]" /> 
          <div className="flex flex-col">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.8]">
              Phim Đang Chiếu
            </h2>
            <span className="text-red-600 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-2 ml-1 opacity-80">
              Danh sách phim hot nhất tại rạp
            </span>
          </div>
        </div>
        
        {/* FIX 2: Đổi link dẫn đến trang Phim Đang Chiếu của bạn */}
        <Link href="/movies/now" className="hidden sm:block">
          <button className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest">
            Xem tất cả 
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-red-600" />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {movies.map((movie: any) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            image={movie.posterUrl} 
            status={movie.status}
            // Nếu bạn muốn hiển thị rating thật từ API, hãy thêm prop rating={movie.rating} ở đây
          />
        ))}
      </div>
    </section>
  );
}