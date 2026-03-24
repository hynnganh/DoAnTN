"use client";
import Link from "next/link";
import { Ticket, Star, CalendarDays } from "lucide-react";

interface MovieCardProps {
  id: number;
  title: string;
  image: string;
  rating?: string | number;
  status?: string;
}

export default function MovieCard({ id, title, image, rating, status }: MovieCardProps) {
  const isShowing = status === "SHOWING";
const displayRating = rating || (Math.random() * (9.5 - 8.0) + 8.0).toFixed(1);

  return (
    <div className="group relative bg-[#121212] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-red-500/20 hover:-translate-y-2 border border-white/5">
      
      {/* Container Ảnh */}
      <div className="relative w-full h-[400px] overflow-hidden bg-zinc-900">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            // Thêm loading lazy để tối ưu tốc độ tải trang
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[10px] uppercase font-bold tracking-tighter">
            Chưa có Poster
          </div>
        )}
        
        {/* Lớp phủ Gradient (Làm tối ảnh một chút để nổi bật nút) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Badge Rating */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-yellow-500/40 z-10">
          <Star size={10} className="fill-yellow-500 text-yellow-500" />
          <span className="text-white text-[10px] font-black tracking-tighter">{displayRating}</span>
        </div>

        {/* Nút thao tác */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20">
          <Link href={`/movies/${id}`}>
            <button className={`flex items-center gap-2 ${isShowing ? 'bg-red-600 hover:bg-red-700' : 'bg-zinc-100 text-black hover:bg-white'} px-6 py-2.5 rounded-xl font-black shadow-2xl transition-all uppercase text-[10px] tracking-widest active:scale-95`}>
              {isShowing ? (
                <>
                  <Ticket size={16} />
                  Mua Vé Ngay
                </>
              ) : (
                <>
                  <CalendarDays size={16} />
                  Xem Chi Tiết
                </>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* Thông tin phía dưới */}
      <div className="p-4 relative">
        <h3 className="font-black text-white text-[15px] line-clamp-1 group-hover:text-red-500 transition-colors duration-300 uppercase tracking-tighter mb-1">
          {title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
            {isShowing ? "2D / 3D • Phụ Đề" : "Sắp khởi chiếu"}
          </span>
          {/* Nhãn giới hạn độ tuổi - Có thể lấy từ DB nếu sau này thêm field ageRating */}
          <span className="text-red-500 text-[9px] font-black border border-red-500/50 px-1.5 py-0.5 rounded italic">
            T18
          </span>
        </div>

        {/* Line hiệu ứng chân card */}
        <div className={`absolute bottom-0 left-0 h-[2px] w-0 ${isShowing ? 'bg-red-600' : 'bg-zinc-400'} transition-all duration-500 group-hover:w-full`} />
      </div>
    </div>
  );
}