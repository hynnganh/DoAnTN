"use client";
import React, { useState } from 'react';
import { Calendar, MapPin, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
// Import BookingModal bạn đã cung cấp
import BookingModal from '@/app/(client)/cinema/components/BookingModal'; 

export default function MovieBookingPage({ params }: { params: { id: string } }) {
  // State quản lý việc mở Modal và truyền thông tin vào Modal
  const [bookingInfo, setBookingInfo] = useState<any>(null);

  // Giả lập dữ liệu phim (Thực tế sẽ fetch theo params.id)
  const movie = {
    id: params.id,
    title: "AVATAR: THE SEED BEARER",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000",
  };

  const handleSelectShowtime = (time: string, cinema: string) => {
    // Khi nhấn vào giờ, ta set object info để Modal hiện lên
    setBookingInfo({
      ...movie,
      time: time,
      cinema: cinema,
      date: "01/03/2026"
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-10 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Breadcrumb */}
        <Link href={`/movies/${params.id}`} className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Quay lại thông tin phim
        </Link>

        <header className="space-y-4 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-4xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-none">
            Lịch chiếu: <span className="text-red-600">{movie.title}</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* CỘT TRÁI: CHỌN SUẤT CHIẾU */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Chọn Ngày */}
            <section className="space-y-6">
              <h3 className="flex items-center gap-3 text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">
                <Calendar size={16} className="text-red-600" /> 01. Chọn ngày xem
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {["01/03", "02/03", "03/03"].map((date, idx) => (
                  <button key={idx} className={`px-8 py-5 rounded-2xl border font-black text-[11px] transition-all ${idx === 0 ? 'bg-red-600 border-red-600 shadow-xl' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                    THỨ {idx + 2}, {date}
                  </button>
                ))}
              </div>
            </section>

            {/* Chọn Rạp & Giờ */}
            <section className="space-y-8">
              <h3 className="flex items-center gap-3 text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">
                <MapPin size={16} className="text-red-600" /> 02. Chọn cụm rạp & suất chiếu
              </h3>

              {["A&K Cinema Thủ Đức", "A&K Cinema Quận 1"].map((cinema, cIdx) => (
                <div key={cinema} className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-8 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: `${cIdx * 100}ms`}}>
                  <h4 className="text-xl md:text-2xl font-[1000] italic uppercase tracking-tight">{cinema}</h4>
                  <div className="flex flex-wrap gap-4">
                    {["10:15", "13:30", "16:45", "19:00", "21:30"].map(time => (
                      <button 
                        key={time}
                        onClick={() => handleSelectShowtime(time, cinema)}
                        className="px-8 py-4 bg-zinc-900/60 border border-white/5 rounded-2xl text-xs font-[1000] hover:bg-red-600 hover:border-red-600 transition-all uppercase italic tracking-[0.2em] active:scale-90"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* CỘT PHẢI: POSTER TÓM TẮT */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 bg-zinc-900/20 border border-white/5 rounded-[3rem] p-10 space-y-8">
               <div className="aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/10">
                  <img src={movie.image} className="w-full h-full object-cover" alt="" />
               </div>
               <div className="text-center space-y-2">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">Đang đặt vé</p>
                  <h5 className="text-xl font-black uppercase italic tracking-tighter">{movie.title}</h5>
               </div>
            </div>
          </aside>
        </div>
      </div>

      {/* --- REUSE BOOKING MODAL --- */}
      {/* Khi bookingInfo có dữ liệu, Modal sẽ hiện lên với flow: Chọn ghế -> Thanh toán -> Success */}
      {bookingInfo && (
        <BookingModal 
          info={bookingInfo} 
          onClose={() => setBookingInfo(null)} 
        />
      )}
    </div>
  );
}