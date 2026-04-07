"use client";
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Ticket as TicketIcon, Loader2, Calendar } from 'lucide-react';
import { apiRequest } from '@/app/lib/api'; 
import Cookies from 'js-cookie';

interface Ticket {
  id: number;
  booking_code: string; 
  status: string;
  seat: { seatRow: string; seatNumber: string; };
  showtime: { startTime: string; movie: { title: string; posterUrl: string; }; };
}

export default function TicketsTab() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token") || Cookies.get("token");
      if (!token) { setLoading(false); return; }
      try {
        const res = await apiRequest('/api/v1/tickets/my-history');
        if (res.ok) {
          const result = await res.json();
          // Lấy toàn bộ mảng data, không dùng slice
          setTickets(result.data || []);
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchHistory();
  }, []);

  // --- SỬA LOGIC LỌC TẠI ĐÂY ---
  const filtered = tickets.filter(t => {
    const showDate = new Date(t.showtime.startTime);
    const now = new Date();

    if (activeFilter === 'upcoming') {
      // Sắp đi: Vé chưa chiếu xong VÀ (đã thanh toán hoặc đang chờ)
      return showDate >= now && (t.status === 'PAID' || t.status === 'PENDING' || t.status === 'BOOKED');
    }
    if (activeFilter === 'done') {
      // Đã đi: Dựa vào thời gian suất chiếu đã qua
      return showDate < now;
    }
    return true; // 'all'
  });

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-red-600" /></div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Filter */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
            Lịch sử ({filtered.length}/{tickets.length})
        </h3>
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          {['all', 'upcoming', 'done'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${
                activeFilter === f ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f === 'all' ? 'Tất cả' : f === 'upcoming' ? 'Sắp đi' : 'Đã đi'}
            </button>
          ))}
        </div>
      </div>

      {/* --- THÊM SCROLL TẠI ĐÂY --- */}
      <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {filtered.map((ticket) => (
          <div 
            key={ticket.id} 
            className="group flex items-center gap-4 p-3 bg-zinc-900/40 rounded-2xl border border-white/5 hover:border-red-600/20 transition-all hover:bg-zinc-900/60"
          >
            <div className="relative w-12 h-16 rounded-xl overflow-hidden shrink-0 shadow-2xl">
              <img src={ticket.showtime.movie.posterUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[8px] font-black text-red-600 uppercase tracking-tighter">#{ticket.booking_code}</p>
              <h4 className="font-bold text-xs text-zinc-100 truncate uppercase tracking-tight group-hover:text-red-500 transition-colors">
                {ticket.showtime.movie.title}
              </h4>
              <div className="flex items-center gap-3 mt-1.5 opacity-60">
                <div className="flex items-center gap-1 text-[9px] font-bold text-white">
                  <Clock size={10} className="text-red-600" /> 
                  {new Date(ticket.showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-400 uppercase">
                  <Calendar size={10} /> 
                  {new Date(ticket.showtime.startTime).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[10px] font-black text-white mb-1">
                {ticket.seat.seatRow}{ticket.seat.seatNumber}
              </div>
              <div className="flex items-center gap-1 justify-end">
                {ticket.status === 'PAID' ? (
                  <CheckCircle2 size={12} className="text-green-500" />
                ) : (
                  <>
                    <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-[7px] text-amber-500 font-black uppercase">{ticket.status}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center opacity-20">
            <TicketIcon size={32} className="mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">Trống</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
      `}</style>
    </div>
  );
}