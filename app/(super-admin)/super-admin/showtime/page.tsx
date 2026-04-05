"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/app/lib/api';
import { 
  Loader2, Calendar, Clock, Film, 
  MapPin, ChevronRight, Monitor, Ticket, X, Building2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import moment from 'moment';

export default function CinemaManagementPage() {
  const router = useRouter();
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/api/v1/showtimes');
        const responseData = await res.json();
        setShowtimes(responseData.data || []);
      } catch (err) {
        toast.error("Lỗi API rồi ông giáo ơi!");
      } finally {
        setLoading(false);
      }
    };
    fetchShowtimes();
  }, []);

  // Gom nhóm dữ liệu: Cinema -> CinemaItem
  const cinemaMap = showtimes.reduce((acc: any, curr: any) => {
    const cinemaName = curr.cinemaItem?.cinema?.name || "Hệ thống rạp";
    const branchId = curr.cinemaItem?.id;

    if (!acc[cinemaName]) acc[cinemaName] = {};
    if (!acc[cinemaName][branchId]) {
      acc[cinemaName][branchId] = {
        info: curr.cinemaItem,
        shows: []
      };
    }
    acc[cinemaName][branchId].shows.push(curr);
    return acc;
  }, {});

  const openModal = (branch: any) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={24} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-2 md:p-2 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="border-b border-white/5 pb-8">
          <div className="flex items-center gap-2 text-red-600 font-black text-[8px] uppercase tracking-[0.4em] mb-2">
            <Building2 size={14} /> Cinema Administration
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Quản lý <span className="text-zinc-600">Hệ thống rạp</span>
          </h1>
        </header>

        {/* DANH SÁCH CINEMA & BRANCHES */}
        <div className="space-y-16">
          {Object.keys(cinemaMap).map((cinemaName) => (
            <div key={cinemaName} className="space-y-6">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-red-600 border-l-4 border-red-600 pl-4">
                {cinemaName}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(cinemaMap[cinemaName]).map((branch: any) => (
                  <div 
                    key={branch.info.id}
                    onClick={() => openModal(branch)}
                    className="group bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 hover:bg-white/[0.04] transition-all cursor-pointer relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-red-600/10 rounded-2xl text-red-600">
                        <MapPin size={20} />
                      </div>
                      <span className="text-[10px] font-black text-zinc-700 uppercase italic">
                        {branch.shows.length} Suất chiếu
                      </span>
                    </div>
                    <h3 className="text-lg font-black uppercase mb-1 group-hover:text-red-500 transition-colors">
                      {branch.info.name}
                    </h3>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                      {branch.info.address}, {branch.info.city}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-[8px] font-black uppercase text-zinc-400 group-hover:text-white transition-colors">
                      Xem chi tiết suất chiếu <ChevronRight size={12} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL HIỆN SUẤT CHIẾU */}
      {isModalOpen && selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-4xl max-h-[85vh] rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
            {/* Modal Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-red-600">
                  {selectedBranch.info.name}
                </h2>
                <p className="text-[9px] font-bold text-zinc-500 uppercase mt-1 tracking-widest flex items-center gap-2">
                  <MapPin size={10} /> {selectedBranch.info.address}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-white/5 hover:bg-red-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Scrollable List */}
            <div className="p-8 overflow-y-auto space-y-4 custom-scrollbar">
              {selectedBranch.shows.map((show: any) => (
                <div 
                  key={show.id}
                  onClick={() => router.push(`/super-admin/showtime/${show.id}`)}
                  className="group flex flex-col md:flex-row md:items-center justify-between bg-white/[0.03] border border-white/5 p-6 rounded-3xl hover:border-red-600/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
                      <Film size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase group-hover:text-red-500 transition-colors">
                        {show.movie?.title}
                      </h4>
                      <div className="flex gap-4 mt-1">
                        <span className="text-[8px] font-black text-zinc-500 uppercase flex items-center gap-1">
                          <Monitor size={10} /> {show.room?.name}
                        </span>
                        <span className="text-[8px] font-black text-zinc-500 uppercase flex items-center gap-1">
                          <Ticket size={10} /> {show.room?.totalSeats} ghế
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 mt-4 md:mt-0 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                    <div className="text-right">
                      <p className="text-[7px] font-black text-zinc-600 uppercase mb-1">Thời gian chiếu</p>
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-red-600" />
                        <span className="text-sm font-black italic tracking-tighter">
                          {moment(show.startTime).format('HH:mm')} — {moment(show.endTime).format('HH:mm')}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-zinc-700 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white/[0.01] border-t border-white/5 text-center">
              <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em]">End of Showtimes List</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}