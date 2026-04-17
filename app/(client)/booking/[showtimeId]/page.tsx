"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import { apiRequest } from '@/app/lib/api'; 
import SeatMap from '../SeatMap'; // Import file SeatMap cùng cấp thư mục
import toast, { Toaster } from 'react-hot-toast';

export default function BookingPage({ params }: { params: Promise<{ showtimeId: string }> }) {
  const { showtimeId } = use(params);
  const router = useRouter();
  const [fetching, setFetching] = useState(true);
  const [dbSeats, setDbSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [showtimeInfo, setShowtimeInfo] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resSeats, resInfo] = await Promise.all([
          apiRequest(`/api/v1/seats/showtime/${showtimeId}`),
          apiRequest(`/api/v1/showtimes/${showtimeId}`)
        ]);
        if (resSeats.ok && resInfo.ok) {
          setDbSeats((await resSeats.json()).data);
          setShowtimeInfo((await resInfo.json()).data);
        }
      } catch (err) { toast.error("Lỗi tải dữ liệu!"); }
      finally { setFetching(false); }
    };
    loadData();
  }, [showtimeId]);

  const handleNext = () => {
    sessionStorage.setItem('booking_data', JSON.stringify({
      showtimeId,
      movieTitle: showtimeInfo?.movie?.title,
      selectedSeats,
      seatPrice: selectedSeats.reduce((sum, s) => sum + s.price, 0)
    }));
    router.push(`/booking/${showtimeId}/combos`);
  };

  if (fetching) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <Toaster />
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 uppercase text-[10px] font-black italic"><ChevronLeft size={16}/> Quay lại</button>
        <div className="text-center font-[1000] uppercase italic text-xl tracking-tighter">{showtimeInfo?.movie?.title}</div>
        <div className="w-20"></div>
      </div>
      <div className="flex-1 py-10">
        <SeatMap 
          dbSeats={dbSeats} 
          selectedSeats={selectedSeats} 
          onToggleSeat={(seat) => setSelectedSeats(prev => prev.find(s => s.id === seat.id) ? prev.filter(s => s.id !== seat.id) : [...prev, seat])} 
        />
      </div>
      <div className="p-8 bg-zinc-950 border-t border-white/5 flex justify-between items-center sticky bottom-0">
        <div>
          <p className="text-[10px] text-zinc-500 font-black uppercase">Ghế: <span className="text-white">{selectedSeats.map(s => s.seatRow + s.seatNumber).join(', ') || '...'}</span></p>
          <div className="text-2xl font-[1000] text-red-600 italic">{(selectedSeats.reduce((sum, s) => sum + s.price, 0)).toLocaleString()}đ</div>
        </div>
        <button onClick={handleNext} disabled={selectedSeats.length === 0} className="px-10 py-4 bg-white text-black font-black uppercase italic rounded-2xl disabled:opacity-20 hover:bg-red-600 hover:text-white transition-all">Chọn Combo <ArrowRight className="inline ml-2" size={16}/></button>
      </div>
    </div>
  );
}