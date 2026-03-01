"use client";
import React from "react";
import Link from "next/link";
import MovieCard from "./MovieCard";
import { ChevronRight } from "lucide-react";

const movies = [
  {
    id: 1,
    title: "Thỏ ơi!",
    image: "/thooi.jpg",
    rating: "9.2"
  },
  {
    id: 2,
    title: "Nhà ba tôi một phòng",
    image: "/nhabatoimotphong.jpg",
    rating: "8.8"
  },
  {
    id: 3,
    title: "Nhà Mình Đi Thôi",
    image: "/nhaminhdithoi.jpg",
    rating: "9.5"
  },
  {
    id: 4,
    title: "Báu vật trời cho",
    image: "/bauvattroicho.jpg",
    rating: "9.0"
  },
];

export default function MovieSection() {
  return (
    <section className="px-6 md:px-12 py-20 bg-[#0f0f0f] min-h-screen">
      
      {/* Header Section */}
      <div className="flex items-end justify-between mb-12">
        <div className="flex items-center gap-5">
          {/* Thanh đỏ nhấn nhá */}
          <div className="w-1.5 h-12 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]" /> 
          
          <div className="flex flex-col">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.8]">
              Phim Đang Chiếu
            </h2>
            {/* Chuyển thành Tiếng Việt */}
            <span className="text-red-600 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-2 ml-1 opacity-80">
              Danh sách phim hot nhất
            </span>
          </div>
        </div>
        
        <Link href="/movies" className="hidden sm:block">
          <button className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest">
            Xem tất cả 
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-red-600" />
          </button>
        </Link>
      </div>

      {/* Grid Danh sách phim */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            image={movie.image}
            rating={movie.rating}
          />
        ))}
      </div>

      {/* Nút xem thêm cho Mobile */}
      <div className="mt-12 sm:hidden flex justify-center">
        <Link href="/movies">
          <button className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest">
            Xem tất cả
          </button>
        </Link>
      </div>
    </section>
  );
}