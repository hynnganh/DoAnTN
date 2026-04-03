"use client";
import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Building2, ChevronRight, Fingerprint, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { apiRequest } from '@/app/lib/api'; 
import AddCinemaModal from './AddCinemaModal';

export default function CinemaPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/api/v1/cinemas');
      if (!res.ok) throw new Error("Fetch failed");
      const result = await res.json();
      const cinemaList = result.data || result;
      setItems(Array.isArray(cinemaList) ? cinemaList : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCinemas(); }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-3 font-sans selection:bg-red-600">
      <Toaster position="top-right" />
      
      <AddCinemaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCinemas} 
      />

      {/* --- HEADER --- */}
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-red-600 animate-pulse"></span>
            <p className="text-red-600 font-bold text-[9px] uppercase tracking-[0.4em]">Internal Management</p>
          </div>
          <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter leading-none">
            Hệ Thống <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Các Quận</span>
          </h1>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative px-8 py-4 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest transition-all hover:bg-red-600 hover:text-white active:scale-95 flex items-center gap-3 shadow-xl"
        >
          <Plus size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          <span>Thêm chi nhánh</span>
        </button>
      </div>

      {/* --- CONTENT --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <Loader2 className="animate-spin text-red-600" size={50} strokeWidth={3} />
          <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">Synchronizing...</p>
        </div>
      ) : (
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.length > 0 ? (
            items.map((item: any) => (
              <div 
                key={item.id} 
                onClick={() => router.push(`/super-admin/cinema/${item.id}`)}
                className="group relative bg-[#0d0d0d] border border-white/5 rounded-[2rem] p-6 transition-all duration-500 hover:border-red-600/40 hover:bg-zinc-900/20 cursor-pointer overflow-hidden shadow-lg flex flex-col justify-between min-h-[220px]"
              >
                {/* ID Watermark - Nhỏ lại cho khớp Card */}
                <div className="absolute -top-4 -left-2 text-[80px] font-black text-white/[0.01] italic leading-none pointer-events-none group-hover:text-red-600/[0.03] transition-all duration-700">
                  {item.id < 10 ? `0${item.id}` : item.id}
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-zinc-900 rounded-xl group-hover:bg-red-600 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-500">
                      <Building2 className="text-zinc-500 group-hover:text-white" size={20} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-600 italic">#CN-{item.id}</span>
                  </div>

                  <h2 className="text-xl font-black uppercase italic text-white leading-tight group-hover:text-red-500 transition-colors line-clamp-2">
                    {item.name}
                  </h2>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-all">
                    <ShieldCheck size={14} className="text-red-600" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Secure</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center border border-dashed border-white/5 rounded-[2rem]">
              <Fingerprint className="mx-auto text-zinc-800 mb-4" size={50} />
              <p className="text-zinc-600 font-black uppercase tracking-[0.4em] italic text-[10px]">No Records Found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}