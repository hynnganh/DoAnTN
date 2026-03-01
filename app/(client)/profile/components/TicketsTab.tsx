"use client";
import React, { useState } from 'react';
import { ArrowRight, Ticket, Clock, CheckCircle2, XCircle } from 'lucide-react';

const TICKETS_DATA = [
  { id: "AK-10293", title: "Spider-Man: Across the Spider-Verse", date: "05/03/2026", time: "20:45", seats: "F08, F09", status: "upcoming", img: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=200" },
  { id: "AK-99281", title: "Avatar: The Way of Water", date: "24/12/2025", time: "19:30", seats: "H12, H13", status: "success", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200" },
  { id: "AK-88271", title: "Oppenheimer", date: "15/01/2026", time: "14:00", seats: "G05", status: "cancelled", img: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=200" },
  { id: "AK-77210", title: "Dune: Part Two", date: "20/02/2026", time: "21:00", seats: "J11, J12", status: "success", img: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=200" },
  { id: "AK-66155", title: "John Wick 4", date: "10/02/2026", time: "18:00", seats: "A01", status: "success", img: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200" },
];

export default function CompactTicketsTab() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTickets = activeFilter === 'all' 
    ? TICKETS_DATA 
    : TICKETS_DATA.filter(t => t.status === activeFilter);

  return (
    <div className="animate-in fade-in duration-500 space-y-6 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter">Lịch sử đặt vé</h2>
        
        {/* BỘ LỌC NHỎ GỌN */}
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'upcoming', label: 'Sắp xem' },
            { id: 'success', label: 'Đã xem' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === tab.id ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VÙNG CUỘN CỐ ĐỊNH (SCROLL AREA) */}
      <div className="relative border border-white/5 rounded-[2.5rem] bg-zinc-900/10 overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto overflow-x-hidden p-4 space-y-3 custom-scrollbar">
          
          {filteredTickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="group flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-transparent hover:border-red-600/30 hover:bg-white/[0.08] transition-all duration-300"
            >
              {/* Thumbnail nhỏ */}
              <div className="w-14 h-20 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <img src={ticket.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
              </div>

              {/* Thông tin chính - Dàn hàng ngang */}
              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <div className="truncate">
                  <p className="text-[8px] text-red-600 font-black uppercase mb-0.5">{ticket.id}</p>
                  <h4 className="font-bold text-sm uppercase truncate tracking-tight group-hover:text-red-500 transition-colors">
                    {ticket.title}
                  </h4>
                </div>
                
                <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-bold">
                  <div className="flex items-center gap-1"><Clock size={12} /> {ticket.time}</div>
                  <div className="text-white/40">{ticket.date}</div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Ghế: {ticket.seats}</span>
                  {ticket.status === 'upcoming' ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : ticket.status === 'cancelled' ? (
                    <XCircle size={16} className="text-red-800" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-700" />
                  )}
                </div>
              </div>

              {/* Nút hành động nhanh */}
              <button className="p-3 rounded-full bg-white/5 hover:bg-red-600 hover:text-white transition-all">
                <ArrowRight size={14} />
              </button>
            </div>
          ))}

          {filteredTickets.length === 0 && (
            <div className="py-20 text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
      `}</style>
    </div>
  );
}