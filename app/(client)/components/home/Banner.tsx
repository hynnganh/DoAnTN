"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const BANNER_DATA = [
  {
    id: 1,
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-curtain-opening-in-a-movie-theater-4050-large.mp4",
    title: "TRẢI NGHIỆM ĐẲNG CẤP",
    desc: "Hệ thống âm thanh Dolby Atmos & Màn hình IMAX cực đại",
    buttonText: "Khám Phá Ngay",
  },
  {
    id: 2,
    type: "image",
    url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070",
    title: "🎬 NEXT CINEMA",
    desc: "Đặt vé nhanh chóng - Tiện lợi - Hiện đại",
    buttonText: "Mua Vé Ngay",
  },
  {
    id: 3,
    type: "image",
    url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070",
    title: "BOM TẤN THÁNG 5",
    desc: "Đừng bỏ lỡ những siêu phẩm hành động kịch tính nhất",
    buttonText: "Xem Lịch Chiếu",
  },
];

export default function Banner() {
  return (
    // Đã thu nhỏ: h-[550px] -> h-[400px]
    <div className="w-full h-[400px] relative group overflow-hidden rounded-xl"> 
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        speed={1000}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        className="h-full w-full"
      >
        {BANNER_DATA.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative w-full h-full flex items-center justify-center">
              
              {item.type === "video" ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={item.url} type="video/mp4" />
                </video>
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center animate-ken-burns"
                  style={{ backgroundImage: `url('${item.url}')` }}
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10"></div>

              {/* Nội dung đã thu nhỏ font size và margin */}
              <div className="relative z-20 text-center text-white px-6 max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight drop-shadow-lg uppercase">
                  {item.title}
                </h1>
                <p className="text-sm md:text-lg text-gray-300 mb-6 font-light italic">
                  {item.desc}
                </p>
                <div className="flex gap-3 justify-center">
                  <button className="bg-red-600 px-6 py-2 rounded-full text-sm font-bold uppercase transition-all duration-300 hover:bg-red-700 hover:scale-105 shadow-lg">
                    {item.buttonText}
                  </button>
                  <button className="backdrop-blur-sm bg-white/10 border border-white/30 px-6 py-2 rounded-full text-sm font-bold uppercase hover:bg-white hover:text-black transition-all">
                    Chi Tiết
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        @keyframes kenburns {
          from { transform: scale(1); }
          to { transform: scale(1.05); } /* Giảm độ scale để đỡ chóng mặt khi khung hình nhỏ */
        }
        .animate-ken-burns {
          animation: kenburns 10s linear infinite alternate;
        }

        /* Thu nhỏ các nút điều hướng */
        .swiper-button-next:after, .swiper-button-prev:after { font-size: 24px !important; }
        .swiper-pagination-bullet { background: white !important; width: 8px; height: 8px; }
        .swiper-pagination-bullet-active { background: #dc2626 !important; width: 20px; }
        
        .swiper-button-next, .swiper-button-prev { color: white !important; opacity: 0; transition: 0.3s; }
        .group:hover .swiper-button-next, .group:hover .swiper-button-prev { opacity: 0.5; }
        .swiper-button-next:hover, .swiper-button-prev:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
}