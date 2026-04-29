"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Trash2, Edit3, MapPin, Film, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/app/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import PromotionModal from './EventModal';

export default function AdminPromotionManager() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedPromo, setSelectedPromo] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<number | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // --- LẤY DANH SÁCH SỰ KIỆN ---
  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/api/v1/promotions');
      const json = await res.json();
      const rawData = json.data?.content || json.data || [];
      
      if (Array.isArray(rawData)) {
        // Sắp xếp ID mới nhất lên đầu
        const sortedData = [...rawData].sort((a, b) => b.id - a.id);
        setPromotions(sortedData);
      } else {
        setPromotions([]);
      }
    } catch (e) {
      toast.error("Không thể kết nối với máy chủ");
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPromotions(); }, [fetchPromotions]);

  // --- THỰC THI XÓA ---
  const executeDelete = async () => {
    if (!promoToDelete) return;
    try {
      const res = await apiRequest(`/api/v1/promotions/${promoToDelete}`, { method: 'DELETE' } as any);
      if (res.ok) {
        toast.success("Đã xóa sự kiện thành công");
        fetchPromotions();
      } else {
        toast.error("Không thể xóa sự kiện này");
      }
    } catch (e) {
      toast.error("Lỗi hệ thống khi xóa");
    } finally {
      setIsDeleteModalOpen(false);
      setPromoToDelete(null);
    }
  };

  // --- BỘ LỌC TÌM KIẾM ---
  const filteredPromotions = promotions.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans">
      <Toaster position="top-right" />
      
      {/* Modal Thêm/Sửa Sự Kiện */}
      <PromotionModal 
        isOpen={isModalOpen} 
        mode={modalMode} 
        data={selectedPromo}
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchPromotions} 
      />

      {/* Modal Xác Nhận Xóa */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={40} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Xác nhận xóa?</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mt-2 tracking-widest leading-relaxed">
              Dữ liệu sự kiện sẽ bị loại bỏ vĩnh viễn khỏi hệ thống
            </p>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 rounded-2xl font-black uppercase text-[10px] text-zinc-400 transition-colors">Hủy bỏ</button>
              <button onClick={executeDelete} className="flex-1 py-4 bg-red-600 hover:bg-red-700 rounded-2xl font-black uppercase text-[10px] text-white shadow-lg shadow-red-600/20 transition-all">Đồng ý xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* Thanh Tiêu Đề & Công Cụ */}
      <header className="p-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <Sparkles className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter leading-none text-white">Sự Kiện</h1>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-1">Quản lý chiến dịch ưu đãi</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors" size={18} />
            <input 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              placeholder="Tìm kiếm theo tiêu đề..." 
              className="w-full bg-zinc-900/40 border border-white/5 pl-14 pr-6 py-4 rounded-2xl text-[11px] font-bold focus:border-red-600/50 outline-none transition-all placeholder:text-zinc-700 text-white" 
            />
          </div>
          <button 
            onClick={() => { setModalMode('create'); setSelectedPromo(null); setIsModalOpen(true); }} 
            className="bg-white text-black h-[52px] px-8 rounded-2xl font-[1000] uppercase text-[11px] flex items-center gap-3 transition-all hover:bg-red-600 hover:text-white active:scale-95 shadow-xl shadow-white/5 shrink-0"
          >
            <Plus size={18} /> Tạo Sự Kiện
          </button>
        </div>
      </header>

      {/* Danh Sách Sự Kiện */}
      <main className="p-8 md:p-12 max-w-[1400px] mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <p className="text-[10px] font-black uppercase text-zinc-700 tracking-widest">Đang kết nối dữ liệu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPromotions.length > 0 ? filteredPromotions.map((p) => (
              <div 
                key={p.id} 
                className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-5 flex flex-col md:flex-row items-center gap-8 group hover:bg-zinc-900/40 hover:border-white/10 transition-all duration-500"
              >
                {/* Ảnh Đại Diện Sự Kiện */}
                <div className="w-full md:w-56 aspect-[16/10] rounded-[1.5rem] overflow-hidden bg-zinc-950 border border-white/5 relative shadow-2xl">
                  <img 
                    src={p.thumbnail?.startsWith("/") ? `${API_BASE}${p.thumbnail}` : p.thumbnail} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                    alt="Hình ảnh sự kiện" 
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                      <span className="text-[9px] font-black text-white uppercase italic tracking-tighter">ID: {p.id}</span>
                  </div>
                </div>

                {/* Thông Tin Chi Tiết */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Đang diễn ra</span>
                  </div>
                  
                  <h4 className="text-2xl font-[1000] uppercase italic tracking-tighter truncate group-hover:text-red-500 transition-colors duration-300 text-white">
                    {p.title}
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium mt-1 line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    {p.content || "Chương trình chưa cập nhật mô tả chi tiết."}
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase text-zinc-300 border border-white/5">
                      <MapPin size={10} className="text-red-500" /> {p.cinemaItem?.name || "Toàn hệ thống"}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase text-zinc-300 border border-white/5">
                      <Film size={10} className="text-red-500" /> {p.movie?.title || "Tất cả phim"}
                    </div>
                  </div>
                </div>

                {/* Nút Điều Khiển */}
                <div className="flex gap-3 shrink-0">
                  <button 
                    onClick={() => { setSelectedPromo(p); setModalMode('edit'); setIsModalOpen(true); }} 
                    className="w-14 h-14 bg-zinc-900/50 hover:bg-white hover:text-black rounded-2xl transition-all flex items-center justify-center border border-white/5 group/btn shadow-lg"
                    title="Chỉnh sửa sự kiện"
                  >
                    <Edit3 size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => { setPromoToDelete(p.id); setIsDeleteModalOpen(true); }} 
                    className="w-14 h-14 bg-zinc-900/50 hover:bg-red-600 hover:text-white rounded-2xl transition-all flex items-center justify-center border border-white/5 group/btn shadow-lg text-zinc-400"
                    title="Gỡ bỏ sự kiện"
                  >
                    <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-[3rem] bg-zinc-900/10">
                <AlertCircle size={60} className="text-zinc-800 mb-6" />
                <p className="font-black uppercase tracking-[0.4em] text-zinc-600 text-sm text-center">
                  Không tìm thấy sự kiện nào
                </p>
                <button 
                  onClick={() => { setModalMode('create'); setSelectedPromo(null); setIsModalOpen(true); }}
                  className="mt-6 text-[10px] font-bold text-red-600 uppercase hover:underline tracking-widest"
                >
                  Bắt đầu tạo sự kiện đầu tiên của bạn
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}