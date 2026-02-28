"use client";
import React from 'react';
// Đảm bảo file MovieCard.tsx nằm cùng thư mục
import MovieCard, { Movie } from '../../components/movie/MovieCard'; 

// --- 1. DỮ LIỆU 12-15 BỘ PHIM ĐANG CHIẾU (DATA) ---
const currentMovies: Movie[] = [
  { id: 1, title: "THỎ ƠI!!", rank: 1, tag: "T18", rating: 9.2, image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800", genre: "Tâm Lý • Kịch Tính", duration: "127 phút" },
  { id: 2, title: "ĐỒI GIÓ HÚ", rank: 2, tag: "T18", isImax: true, rating: 8.8, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800", genre: "Lãng Mạn • Cổ Điển", duration: "136 phút" },
  { id: 3, title: "BÁU VẬT TRỜI CHO", rank: 3, tag: "K", isImax: true, rating: 8.5, image: "https://images.unsplash.com/photo-1598899139113-247240407d9b?q=80&w=800", genre: "Gia Đình • Hài Hước", duration: "124 phút" },
  { id: 4, title: "NHÀ BA TÔI MỘT PHÒNG", rank: 4, tag: "P", rating: 7.9, image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800", genre: "Gia Đình • Tâm Lý", duration: "126 phút" },
  { id: 5, title: "KẺ DU HÀNH CUỐI", rank: 5, tag: "T13", rating: 8.1, image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800", genre: "Viễn Tưởng • Hành Động", duration: "145 phút" },
  { id: 6, title: "TIẾNG VỌNG RỪNG SÂU", rank: 6, tag: "T16", rating: 7.5, image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800", genre: "Kinh Dị • Bí Ẩn", duration: "110 phút" },
  { id: 7, title: "GIAI ĐIỆU MÙA HÈ", rank: 7, tag: "P", rating: 8.9, image: "https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=800", genre: "Âm Nhạc • Thanh Xuân", duration: "95 phút" },
  { id: 8, title: "TRẬN CHIẾN CUỐI CÙNG", rank: 8, tag: "T18", isImax: true, rating: 9.5, image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800", genre: "Chiến Tranh • Sử Thi", duration: "155 phút" },
  { id: 9, title: "THÀNH PHỐ KHÔNG NGỦ", rank: 9, tag: "T16", rating: 8.2, image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800", genre: "Hành Động • Tội Phạm", duration: "118 phút" },
  { id: 10, title: "GIẤC MƠ NGHỆ THUẬT", rank: 10, tag: "P", rating: 8.7, image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=800", genre: "Tài Liệu • Nghệ Thuật", duration: "92 phút" },
  { id: 11, title: "SIÊU TRỘM THẾ KỶ", tag: "T13", rating: 8.4, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800", genre: "Hành Động • Hài", duration: "112 phút" },
  { id: 12, title: "VÙNG ĐẤT CÂM LẶNG", tag: "T16", rating: 7.8, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800", genre: "Kinh Dị • Giật Gân", duration: "105 phút" },
  { id: 13, title: "CHUYẾN ĐI NHỚ ĐỜI", tag: "P", rating: 8.0, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800", genre: "Phiêu Lưu • Gia Đình", duration: "120 phút" },
  { id: 14, title: "QUÁI VẬT KHÔNG GIAN", tag: "T18", isImax: true, rating: 9.1, image: "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=800", genre: "Viễn Tưởng • Kinh Dị", duration: "132 phút" },
  { id: 15, title: "VŨ ĐIỆU CUỐI CÙNG", tag: "P", rating: 8.3, image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800", genre: "Âm Nhạc • Tâm Lý", duration: "110 phút" },
];

export default function PhimDangChieu() {
  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-6 md:px-16 text-white font-sans">
      {/* Inject CSS Animation (Đỏ cho Đang Chiếu) */}
      <style>{`
        @keyframes shimmer-red { 0% { transform: translateX(-150%) skewX(-12deg); } 100% { transform: translateX(150%) skewX(-12deg); } }
        .animate-shimmer-red { animation: shimmer-red 2s infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .custom-shadow-rank { text-shadow: 0 0 40px rgba(220, 38, 38, 0.2); }
      `}</style>

      {/* --- HEADER --- */}
      <div className="max-w-[1440px] mx-auto mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600 font-black tracking-[0.4em] text-[10px] uppercase">
            <span className="w-16 h-[2px] bg-red-600"></span>
            A&K Cinema Now Showing
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
            PHIM <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
              ĐANG CHIẾU
            </span>
          </h1>
        </div>
        
        <div className="max-w-xs text-gray-500 text-sm font-bold leading-relaxed border-l-2 border-red-600 pl-6 mb-2">
            Trải nghiệm điện ảnh đỉnh cao với những siêu phẩm mới nhất. Đặt vé ngay để nhận vị trí ngồi đẹp nhất!
        </div>
      </div>

      {/* --- GRID HIỂN THỊ (Sử dụng MovieCard với type="showing") --- */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
        {currentMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} type="showing" />
        ))}
      </div>

      {/* --- FOOTER DECORATION --- */}
      <div className="mt-32 text-center border-t border-white/5 pt-20">
        <p className="text-gray-600 font-bold tracking-widest text-xs uppercase mb-6">Bạn đang xem danh sách phim đang chiếu tại A&K Cinema</p>
        <button className="px-12 py-5 border border-white/10 rounded-full font-black text-[10px] tracking-[0.4em] uppercase text-gray-400 hover:text-white hover:border-red-600 transition-all active:scale-95">
          Xem lịch chiếu hôm nay
        </button>
      </div>
    </div>
  );
}