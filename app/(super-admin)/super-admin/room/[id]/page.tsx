"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/app/lib/api';
import { 
  Loader2, ArrowLeft, LayoutGrid, 
  ChevronRight, Monitor, Disc, Layers,
  ShieldCheck
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function SuperAdminRoomViewPage() {
  const params = useParams();
  const router = useRouter();
  const cinemaItemId = params?.id; // Lấy ID cụm rạp từ URL

  const [rooms, setRooms] = useState<any[]>([]);
  const [cinemaItem, setCinemaItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!cinemaItemId) return;
    try {
      setLoading(true);
      const [resItem, resRooms] = await Promise.all([
        apiRequest(`/api/v1/cinema-items/${cinemaItemId}`),
        apiRequest(`/api/v1/rooms/cinema-item/${cinemaItemId}`)
      ]);
      
      const dataItem = await resItem.json();
      const dataRooms = await resRooms.json();
      
      setCinemaItem(dataItem.data || dataItem);
      setRooms(dataRooms.data || dataRooms || []);
    } catch (err) {
      toast.error("Lỗi kết nối dữ liệu hệ thống");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [cinemaItemId]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-red-600" size={32} />
      <span className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-600 italic">Đang truy xuất dữ liệu...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-red-600 relative overflow-hidden">
      <Toaster position="top-right" />
      <div className="fixed top-[-5%] left-[-5%] w-[30%] h-[30%] bg-red-600/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-6 text-[9px] font-black uppercase tracking-widest"
        >
          <div className="p-1.5 border border-white/5 rounded-full group-hover:border-red-600/40 transition-colors">
            <ArrowLeft size={12} />
          </div>
          Quay lại
        </button>

        <header className="mb-10 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-red-600" />
              <span className="text-zinc-500 font-bold text-[8px] uppercase tracking-[0.3em]">Giám sát: {cinemaItem?.name || "Cinema"}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
              Danh sách phòng chiếu
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room) => (
            <div 
              key={room.id}
              className="group relative bg-[#080808] border border-white/5 rounded-[1.5rem] p-6 transition-all hover:border-red-600/30 hover:-translate-y-1 duration-400 overflow-hidden shadow-xl cursor-pointer"
              // CHỈNH SỬA: Chuyển sang URL /super-admin/seat/[id]
              onClick={() => router.push(`/super-admin/seat/${room.id}`)}
            >
              <div className="absolute top-4 right-6 text-5xl font-black text-white/[0.01] italic group-hover:text-red-600/[0.03] transition-colors pointer-events-none">
                {room.id}
              </div>

              <div className="p-3.5 bg-zinc-900/50 rounded-2xl border border-white/5 w-fit mb-8 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 relative z-10">
                <LayoutGrid size={20} />
              </div>

              <div className="space-y-4 mb-8 relative z-10">
                <h3 className="text-xl font-black uppercase italic leading-none group-hover:text-red-500 transition-colors">
                  {room.name}
                </h3>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[7px] text-zinc-600 font-black uppercase mb-0.5">Phân loại</p>
                    <p className="text-[9px] text-zinc-300 font-bold uppercase">{room.typeRoom || "Laser"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                   <Disc className="text-red-600 animate-spin-slow" size={12} />
                   <span className="text-[8px] font-black uppercase tracking-[0.1em] text-zinc-500 group-hover:text-white italic">Sơ đồ ghế</span>
                </div>
                <div className="p-1.5 bg-white/5 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all shadow-md">
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}