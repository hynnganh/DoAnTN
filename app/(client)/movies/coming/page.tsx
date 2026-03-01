"use client";
import React from 'react';
// Lưu ý: Đảm bảo bạn đã lưu file MovieCard.tsx cùng thư mục
import MovieCard, { Movie } from '../MovieCard'; 

const upcomingMovies: Movie[] = [
  { id: 101, title: "CHIẾN BINH CUỐI CÙNG", tag: "T13", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800", genre: "Hành Động • Viễn Tưởng", duration: "142 phút", releaseDate: "15/03/2026", isHot: true, isImax: true },
  { id: 102, title: "GIAI ĐIỆU TRÊN MÂY", tag: "P", image: "https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=800", genre: "Âm Nhạc • Lãng Mạn", duration: "115 phút", releaseDate: "20/03/2026" },
  { id: 103, title: "BÍ MẬT DƯỚI ĐÁY BIỂN", tag: "T16", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800", genre: "Kinh Dị • Bí Ẩn", duration: "108 phút", releaseDate: "05/04/2026", isHot: true },
  { id: 104, title: "HÀNH TRÌNH TỚI MARS", tag: "K", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800", genre: "Phiêu Lưu • Khoa Học", duration: "130 phút", releaseDate: "12/04/2026", isImax: true },
  { id: 105, title: "MÈO BÉO PHIÊU LƯU KÝ", tag: "P", image: "https://images.unsplash.com/photo-1591871937573-74dbba515c4c?q=80&w=800", genre: "Hoạt Hình • Hài", duration: "90 phút", releaseDate: "18/04/2026" },
  { id: 106, title: "SÁT THỦ VÔ HÌNH", tag: "T18", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800", genre: "Hành Động • Kịch Tính", duration: "125 phút", releaseDate: "30/04/2026", isHot: true },
  { id: 107, title: "RỪNG GIÀ HUYỀN BÍ", tag: "P", image: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=800", genre: "Phiêu Lưu • Gia Đình", duration: "110 phút", releaseDate: "01/05/2026" },
  { id: 108, title: "TRẠM KHÔNG GIAN 07", tag: "T13", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800", genre: "Viễn Tưởng • Tâm Lý", duration: "135 phút", releaseDate: "15/05/2026", isImax: true },
  { id: 109, title: "MẢNH GHÉP KÝ ỨC", tag: "T16", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800", genre: "Tâm Lý • Giật Gân", duration: "120 phút", releaseDate: "20/05/2026" },
  { id: 110, title: "VŨ ĐIỆU ĐÊM HÈ", tag: "P", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800", genre: "Âm Nhạc • Thanh Xuân", duration: "100 phút", releaseDate: "01/06/2026" },
  { id: 111, title: "LỜI NGUYỀN CỔ ĐẠI", tag: "T18", image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800", genre: "Kinh Dị • Tâm Linh", duration: "112 phút", releaseDate: "15/06/2026", isHot: true },
  { id: 112, title: "BIỆT ĐỘI SIÊU NHÂN", tag: "K", image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=800", genre: "Hành Động • Hài", duration: "118 phút", releaseDate: "30/06/2026" },
  { id: 113, title: "THÀNH PHỐ TƯƠNG LAI", tag: "T13", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800", genre: "Viễn Tưởng", duration: "145 phút", releaseDate: "05/07/2026" },
  { id: 114, title: "CHUYẾN TÀU SINH TỬ 2", tag: "T18", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800", genre: "Kịch Tính • Hành Động", duration: "128 phút", releaseDate: "12/07/2026", isHot: true },
  { id: 115, title: "ẢO THUẬT GIA CUỐI CÙNG", tag: "P", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800", genre: "Ảo Thuật • Tâm Lý", duration: "110 phút", releaseDate: "20/07/2026" },
];

export default function PhimSapChieu() {
  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-6 md:px-16 text-white font-sans">
      {/* Cần Inject CSS cho các Animation đặc biệt vì không có file config */}
      <style>{`
        @keyframes shimmer-blue { 0% { transform: translateX(-150%) skewX(-12deg); } 100% { transform: translateX(150%) skewX(-12deg); } }
        @keyframes shimmer-red { 0% { transform: translateX(-150%) skewX(-12deg); } 100% { transform: translateX(150%) skewX(-12deg); } }
        .animate-shimmer-blue { animation: shimmer-blue 2s infinite; }
        .animate-shimmer-red { animation: shimmer-red 2s infinite; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .custom-shadow-rank {
          text-shadow: 0 0 40px rgba(220, 38, 38, 0.15);
        }
      `}</style>

      {/* --- HEADER --- */}
      <div className="max-w-[1440px] mx-auto mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-500 font-black tracking-[0.4em] text-[10px] uppercase">
            <span className="w-16 h-[2px] bg-blue-500"></span>
            Coming Soon to A&K Cinema
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
            PHIM <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400">
              SẮP CHIẾU
            </span>
          </h1>
        </div>
        
        <div className="max-w-xs text-gray-500 text-sm font-bold leading-relaxed border-l-2 border-blue-600 pl-6 mb-2">
            Đừng bỏ lỡ những siêu phẩm điện ảnh sắp đổ bộ. Nhấn "Nhận thông báo" để là người đầu tiên sở hữu vé!
        </div>
      </div>

      {/* --- GRID HIỂN THỊ --- */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
        {upcomingMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} type="upcoming" />
        ))}
      </div>

      {/* --- FOOTER DECORATION --- */}
      <div className="mt-32 text-center border-t border-white/5 pt-20">
        <p className="text-gray-600 font-bold tracking-widest text-xs uppercase mb-6">Bạn đang xem danh sách phim sắp khởi chiếu năm 2026</p>
        <button className="px-12 py-5 border border-white/10 rounded-full font-black text-[10px] tracking-[0.4em] uppercase text-gray-400 hover:text-white hover:border-blue-600 transition-all active:scale-95">
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}