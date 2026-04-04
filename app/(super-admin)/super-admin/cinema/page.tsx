"use client";
import React, { useState, useEffect } from 'react';
import { 
  Loader2, Plus, Building2, ChevronRight, 
  Fingerprint, ShieldCheck, Edit3, Trash2, 
  AlertTriangle, X 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { apiRequest } from '@/app/lib/api'; 
import AddCinemaModal from './AddCinemaModal';

// --- SUB-COMPONENT: MODAL XÁC NHẬN XÓA ---
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6 border border-red-600/20">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase italic mb-2 tracking-tight">Xác nhận xóa?</h2>
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed mb-8">
            Hành động này sẽ loại bỏ <span className="text-white">"{title}"</span> và toàn bộ dữ liệu liên quan vĩnh viễn.
          </p>
          <div className="flex w-full gap-3">
            <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-zinc-900 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all">
              Hủy bỏ
            </button>
            <button onClick={onConfirm} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-500 shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2">
              <Trash2 size={14} /> Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT: CINEMA PAGE ---
export default function CinemaPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý Modal thêm/sửa
  const [modalItem, setModalItem] = useState<any>(undefined);
  // State quản lý Modal xóa
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/api/v1/cinemas');
      const result = await res.json();
      setItems(Array.isArray(result.data || result) ? (result.data || result) : []);
    } catch (err) {
      toast.error("Không thể kết nối với máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCinemas(); }, []);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await apiRequest(`/api/v1/cinemas/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Đã loại bỏ chi nhánh");
        setDeleteTarget(null);
        fetchCinemas();
      }
    } catch (err) { 
      toast.error("Lỗi: Không thể xóa dữ liệu"); 
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans selection:bg-red-600 tracking-tight">
      <Toaster position="top-right" />
      
      {/* Modal Thêm/Sửa */}
      <AddCinemaModal 
        isOpen={modalItem !== undefined} 
        onClose={() => setModalItem(undefined)} 
        onSuccess={fetchCinemas} 
        initialData={modalItem} 
      />

      {/* Modal Xác nhận xóa (Nằm chung 1 file) */}
      <ConfirmDeleteModal 
        isOpen={!!deleteTarget}
        title={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* HEADER */}
      <header className="max-w-7xl mx-auto flex flex-wrap justify-between items-end mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            <p className="text-red-600 font-bold text-[10px] uppercase tracking-[0.3em]">Hệ thống quản trị</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase leading-none">
            Khu vực <span className="text-red-600">Thành phố</span>
          </h1>
        </div>
        
        <button 
          onClick={() => setModalItem(null)}
          className="px-8 py-4 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 shadow-xl active:scale-95"
        >
          <Plus size={16} /> Thêm chi nhánh
        </button>
      </header>

      {/* GRID LIST */}
      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="py-40 flex flex-col items-center gap-4 opacity-50">
            <Loader2 className="animate-spin text-red-600" size={32} />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Đang đồng bộ...</span>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                onClick={() => router.push(`/super-admin/cinema/${item.id}`)}
                className="group relative bg-zinc-900/30 border border-white/5 rounded-3xl p-6 transition-all hover:border-red-600/40 hover:bg-zinc-900/60 cursor-pointer overflow-hidden shadow-2xl"
              >
                <div className="absolute -top-4 -left-2 text-6xl font-black text-white/[0.03] italic select-none">
                  #{item.id}
                </div>

                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-red-600 transition-all duration-300">
                    <Building2 size={22} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setModalItem(item); }} 
                      className="p-2.5 bg-white/10 hover:bg-white hover:text-black rounded-xl transition-all"
                    >
                      <Edit3 size={15}/>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); }} 
                      className="p-2.5 bg-white/10 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={15}/>
                    </button>
                  </div>
                </div>

                <div className="relative z-10 mb-6">
                  <h3 className="text-xl font-black uppercase italic truncate group-hover:text-red-500 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wide truncate mt-1">
                    {item.address || 'Địa chỉ đang cập nhật'}
                  </p>
                </div>

                <div className="pt-5 border-t border-white/5 flex justify-between items-center opacity-50 group-hover:opacity-100 transition-opacity relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Hoạt động</span>
                  </div>
                  <div className="flex items-center gap-1 group/btn">
                    <span className="text-[8px] font-black uppercase text-zinc-500 group-hover/btn:text-white">Chi tiết</span>
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
            <Fingerprint className="mx-auto mb-4 text-zinc-800" size={56} />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-600">Dữ liệu trống</p>
          </div>
        )}
      </main>
    </div>
  );
}