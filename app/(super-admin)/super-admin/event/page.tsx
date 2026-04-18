"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Search, Filter, Trash2, Edit3, MapPin, Film, 
  Sparkles, Loader2, Calendar, MoreHorizontal, ExternalLink,
  AlertCircle, ChevronRight, X
} from 'lucide-react';
import { apiRequest } from '@/app/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import PromotionModal from './EventModal';

export default function AdminPromotionManager() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // States cho Modal Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedPromo, setSelectedPromo] = useState<any>(null);

  // States cho xác nhận xóa
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<number | null>(null);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/api/v1/promotions');
      const json = await res.json();
      const data = json.data?.content || json.data || [];
      setPromotions(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error("Lỗi đồng bộ dữ liệu");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPromotions(); }, [fetchPromotions]);

  const handleDeleteClick = (id: number) => {
    setPromoToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!promoToDelete) return;
    try {
      const res = await apiRequest(`/api/v1/promotions/${promoToDelete}`, { method: 'DELETE' } as any);
      if (res.ok) {
        toast.success("Đã gỡ bỏ sự kiện thành công");
        fetchPromotions();
      }
    } catch (e) { toast.error("Lỗi kết nối"); }
    finally { 
      setIsDeleteModalOpen(false); 
      setPromoToDelete(null);
    }
  };

  const filteredPromotions = promotions.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cinemaItem?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans">
      <Toaster position="top-right" />
      
      {/* Modal chính (Thêm/Sửa) */}
      <PromotionModal 
        isOpen={isModalOpen} mode={modalMode} data={selectedPromo}
        onClose={() => setIsModalOpen(false)} onRefresh={fetchPromotions} 
      />

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 mb-2">
              <Trash2 size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tight">Xóa chiến dịch?</h3>
              <p className="text-zinc-500 text-sm mt-2">Dữ liệu này sẽ biến mất vĩnh viễn khỏi hệ thống.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-bold transition-all">Hủy</button>
              <button onClick={executeDelete} className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col h-screen">
        {/* Top Header */}
        <header className="p-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600 rounded-2xl">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">Campaign <span className="text-red-600">Pro</span></h1>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-none mt-1">Quản lý khuyến mãi hệ thống</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input 
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm nhanh..." 
                className="w-full bg-zinc-900/50 border border-white/5 pl-12 pr-4 py-3 rounded-xl text-xs focus:border-red-600 outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => { setModalMode('create'); setSelectedPromo(null); setIsModalOpen(true); }}
              className="bg-white text-black p-3 md:px-6 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={16} /> <span className="hidden md:block">Tạo mới</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden flex flex-col p-6 md:p-10 space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500">
              <Filter size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Danh sách hiện hành ({filteredPromotions.length})</span>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-red-600" size={40} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <div className="flex-1 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
              {/* Table Header */}
              <div className="grid grid-cols-12 p-6 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <div className="col-span-5 md:col-span-6">Thông tin chiến dịch</div>
                <div className="col-span-3 hidden md:block text-center">Áp dụng cho</div>
                <div className="col-span-4 md:col-span-3 text-right">Hành động</div>
              </div>

              {/* Table Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredPromotions.length > 0 ? filteredPromotions.map((p) => (
                  <div key={p.id} className="grid grid-cols-12 items-center p-6 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                    {/* Info */}
                    <div className="col-span-5 md:col-span-6 flex items-center gap-4">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/5">
                        <img src={p.thumbnail} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold truncate group-hover:text-red-500 transition-colors italic">{p.title}</h4>
                        <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tighter">ID: #{p.id}</p>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="col-span-3 hidden md:flex flex-col gap-1 items-center justify-center">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                         <MapPin size={10} className="text-red-500" /> {p.cinemaItem?.name || "Toàn hệ thống"}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                         <Film size={10} className="text-red-500" /> {p.movie?.title || "Tất cả phim"}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-7 md:col-span-3 flex justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedPromo(p); setModalMode('edit'); setIsModalOpen(true); }}
                        className="p-3 bg-zinc-800 hover:bg-white hover:text-black rounded-xl transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(p.id)}
                        className="p-3 bg-zinc-800 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-700 opacity-50">
                    <AlertCircle size={40} className="mb-2" />
                    <p className="text-xs font-black uppercase tracking-widest">Không có dữ liệu</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}