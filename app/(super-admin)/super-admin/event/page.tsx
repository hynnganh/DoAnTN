"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Trash2, Edit3, MapPin, Film, Sparkles, MoreHorizontal, LayoutGrid, List, Loader2 } from 'lucide-react';
import { apiRequest } from '@/app/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import PromotionModal from './EventModal';

export default function AdminPromotionManager() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view');
  const [selectedPromo, setSelectedPromo] = useState<any>(null);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/api/v1/promotions');
      const json = await res.json();
      const data = json.data || [];
      setPromotions(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error("Lỗi đồng bộ dữ liệu");
      setPromotions([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPromotions(); }, [fetchPromotions]);

  // Nghiệp vụ: Lọc dữ liệu tại chỗ
  const filteredPromotions = promotions.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cinemaItem?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 p-4 md:p-8 font-sans">
      <Toaster position="top-right" />
      <PromotionModal 
        isOpen={isModalOpen} mode={modalMode} data={selectedPromo}
        onClose={() => setIsModalOpen(false)} onRefresh={fetchPromotions} 
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/40 p-6 rounded-[2rem] border border-white/5 shadow-2xl">
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
              <Sparkles className="text-red-600" size={24} /> Promotion Center
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">Quản lý chiến dịch & Marketing</p>
          </div>
          <button 
            onClick={() => { setModalMode('create'); setSelectedPromo(null); setIsModalOpen(true); }}
            className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-white hover:text-red-600 text-white font-black uppercase text-[10px] rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
          >
            + Khởi tạo chiến dịch
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm sự kiện, tên rạp..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 pl-12 pr-4 py-3 rounded-xl outline-none focus:border-red-600/50 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-white"><Filter size={18}/></button>
            <button className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-white"><LayoutGrid size={18}/></button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-red-600 w-10 h-10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromotions.map((p) => (
              <div key={p.id} className="group relative bg-zinc-900/20 border border-white/5 rounded-[2rem] overflow-hidden hover:border-red-600/30 transition-all duration-500 shadow-xl">
                {/* Image & Overlay */}
                <div className="relative aspect-video bg-zinc-800">
                  <img src={p.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute top-4 right-4 flex gap-1">
                    <button onClick={() => { setSelectedPromo(p); setModalMode('edit'); setIsModalOpen(true); }} className="p-2 bg-black/60 backdrop-blur-md rounded-lg hover:bg-white hover:text-black transition-all"><Edit3 size={14}/></button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 pt-2 relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-red-600/10 text-red-500 text-[8px] font-black uppercase border border-red-600/20 rounded-md">Hot Deal</span>
                    <span className="text-[10px] font-black text-zinc-600 italic">#{p.id}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold uppercase italic tracking-tight line-clamp-1 group-hover:text-red-600 transition-colors">{p.title}</h3>
                  
                  <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-3 text-zinc-400">
                      <div className="p-1.5 bg-zinc-800 rounded-md"><MapPin size={12}/></div>
                      <span className="text-[10px] font-bold uppercase tracking-tight">{p.cinemaItem?.name || "Hệ thống"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400">
                      <div className="p-1.5 bg-zinc-800 rounded-md"><Film size={12}/></div>
                      <span className="text-[10px] font-bold uppercase tracking-tight line-clamp-1">{p.movie?.title || "Áp dụng tất cả phim"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}