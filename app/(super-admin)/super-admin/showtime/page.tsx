"use client";
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/app/lib/api';
import { 
  Loader2, Film, MapPin, ChevronRight, 
  X, Building2, Filter, CheckCircle2, 
  AlertCircle, CalendarDays, Calendar as CalendarIcon,
  ArrowUpRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);
dayjs.locale('vi');

export default function CinemaManagementPage() {
  const router = useRouter();
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'UPCOMING' | 'PAST'>('ALL');
  const [timeView, setTimeView] = useState<'WEEK' | 'MONTH' | 'ALL'>('MONTH');
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  useEffect(() => { fetchShowtimes(); }, []);

  const fetchShowtimes = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/api/v1/showtimes');
      const responseData = await res.json();
      setShowtimes(responseData.data || []);
    } catch (err) { toast.error("Lỗi đồng bộ dữ liệu!"); } 
    finally { setLoading(false); }
  };

  const filteredShowtimes = useMemo(() => {
    const now = dayjs();
    return showtimes.filter(show => {
      const showTime = dayjs(show.startTime);
      if (filterStatus === 'UPCOMING' && !showTime.isAfter(now)) return false;
      if (filterStatus === 'PAST' && showTime.isAfter(now)) return false;
      if (timeView === 'WEEK') return showTime.isSame(now, 'week');
      if (timeView === 'MONTH') {
        return showTime.month() === selectedMonth && showTime.isSame(now, 'year');
      }
      return true;
    });
  }, [showtimes, filterStatus, timeView, selectedMonth]);

  const cinemaMap = useMemo(() => {
    return filteredShowtimes.reduce((acc: any, curr: any) => {
      const cinemaName = curr.cinemaItem?.cinema?.name || "Hệ thống rạp";
      const branchId = curr.cinemaItem?.id;
      if (!acc[cinemaName]) acc[cinemaName] = {};
      if (!acc[cinemaName][branchId]) acc[cinemaName][branchId] = { info: curr.cinemaItem, shows: [] };
      acc[cinemaName][branchId].shows.push(curr);
      return acc;
    }, {});
  }, [filteredShowtimes]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-red-600" size={40} />
      <p className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.3em]">Đang đồng bộ...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="space-y-8 border-b border-white/5 pb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-red-600 font-black text-[9px] uppercase tracking-[0.4em] mb-3">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                Hệ thống quản trị
              </div>
              <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter leading-none">
                Cinema <span className="text-zinc-800">Admin</span>
              </h1>
            </div>

            <div className="flex bg-zinc-900/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
              {['ALL', 'UPCOMING', 'PAST'].map((s) => (
                <button key={s} onClick={() => setFilterStatus(s as any)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${filterStatus === s ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'text-zinc-500 hover:text-white'}`}>
                  {s === 'ALL' ? 'Tất cả' : s === 'UPCOMING' ? 'Sắp chiếu' : 'Lịch sử'}
                </button>
              ))}
            </div>
          </div>

          {/* MONTH SELECTOR */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-white/[0.02] p-4 rounded-[2rem] border border-white/5">
             <div className="flex items-center gap-3 px-4 border-r border-white/10 shrink-0">
                <CalendarIcon size={18} className="text-red-600" />
                <div className="flex bg-black p-1 rounded-xl border border-white/5">
                   {['WEEK', 'MONTH', 'ALL'].map((v) => (
                      <button key={v} onClick={() => setTimeView(v as any)}
                        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${timeView === v ? 'bg-white text-black' : 'text-zinc-600 hover:text-zinc-400'}`}>
                        {v === 'WEEK' ? 'Tuần' : v === 'MONTH' ? 'Tháng' : 'Tất cả'}
                      </button>
                   ))}
                </div>
             </div>

             <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {Array.from({ length: 12 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedMonth(i); setTimeView('MONTH'); }}
                    className={`min-w-[45px] h-[45px] rounded-2xl flex flex-col items-center justify-center transition-all border ${
                      selectedMonth === i && timeView === 'MONTH'
                      ? 'bg-red-600 border-red-600 text-white shadow-lg scale-110 z-10' 
                      : 'border-white/5 bg-zinc-900/30 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-[8px] font-black uppercase leading-none mb-1 opacity-60">Thg</span>
                    <span className="text-sm font-black italic leading-none">{i + 1}</span>
                  </button>
                ))}
             </div>
          </div>
        </header>

        {/* LIST HIỂN THỊ */}
        <div className="space-y-16 pb-20">
          {Object.keys(cinemaMap).map((cinemaName) => (
            <div key={cinemaName} className="group animate-in fade-in slide-in-from-left-4">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-white/90">
                  {cinemaName}
                </h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(cinemaMap[cinemaName]).map((branch: any) => (
                  <div 
                    key={branch.info.id}
                    onClick={() => { setSelectedBranch(branch); setIsModalOpen(true); }}
                    className="group/card bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-8 hover:border-red-600/40 transition-all cursor-pointer relative"
                  >
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-14 h-14 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center group-hover/card:bg-red-600 transition-all">
                          <Building2 size={24} className="text-zinc-600 group-hover/card:text-white" />
                       </div>
                       <div className="text-right">
                          <span className="block text-2xl font-[1000] italic text-white/20 leading-none tracking-tighter">
                             {String(branch.shows.length).padStart(2, '0')}
                          </span>
                          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Suất</span>
                       </div>
                    </div>
                    
                    <h3 className="text-xl font-black uppercase mb-2 group-hover/card:text-red-500 transition-colors">
                      {branch.info.name}
                    </h3>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wide truncate mb-6 border-l-2 border-zinc-800 pl-3">
                      {branch.info.address}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                       <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover/card:text-white transition-colors flex items-center gap-2">
                          CHI TIẾT <ChevronRight size={14} />
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL CHI TIẾT */}
      {isModalOpen && selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-4xl max-h-[85vh] rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/20">
              <div>
                <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter">{selectedBranch.info.name}</h2>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1 italic">Chọn một suất chiếu để quản lý chi tiết</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-red-600 rounded-full transition-all">
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
              {selectedBranch.shows.sort((a: any, b: any) => dayjs(a.startTime).unix() - dayjs(b.startTime).unix()).map((show: any) => (
                <div 
                  key={show.id} 
                  // Link điều hướng tại đây
                  onClick={() => router.push(`/super-admin/showtime/${show.id}`)}
                  className="group/item flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-red-600/5 hover:border-red-600/30 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center group-hover/item:bg-red-600 border border-white/5 transition-all">
                        <Film size={20} className="text-zinc-600 group-hover/item:text-white" />
                      </div>
                      <div>
                         <span className="px-2 py-0.5 bg-zinc-800 text-[8px] font-black text-zinc-400 rounded uppercase mb-2 block w-fit">Phòng {show.room?.name}</span>
                         <h4 className="text-lg font-black uppercase leading-tight tracking-tight group-hover/item:text-red-500 transition-colors">{show.movie?.title}</h4>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 text-right">
                       <div>
                          <span className="text-3xl font-[1000] italic text-white tracking-tighter leading-none block group-hover/item:text-white transition-colors">
                             {dayjs(show.startTime).format('HH:mm')}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-bold uppercase">{dayjs(show.startTime).format('DD/MM/YYYY')}</span>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/item:bg-white group-hover/item:text-black transition-all">
                          <ArrowUpRight size={18} />
                       </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}