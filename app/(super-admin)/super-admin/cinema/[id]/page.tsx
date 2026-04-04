"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/app/lib/api';
import { 
  Loader2, Clapperboard, MapPin, 
  ArrowLeft, Monitor, Plus, Clock, 
  ChevronRight, LayoutGrid, Trash2, Edit3, AlertTriangle, X 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AddCinemaItemModal from './CinemaItem';

// --- MODAL XÁC NHẬN XÓA ---
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6 border border-red-600/20">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase italic mb-2">Xác nhận xóa?</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8">
            Phòng <span className="text-white">"{title}"</span> sẽ bị loại bỏ vĩnh viễn.
          </p>
          <div className="flex w-full gap-3">
            <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-zinc-900 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all">Hủy</button>
            <button onClick={onConfirm} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-500 transition-all">Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CinemaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [cinema, setCinema] = useState<any>(null);
  const [cinemaItems, setCinemaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Quản lý Modal Thêm/Sửa (undefined: đóng, null: thêm mới, object: sửa)
  const [modalData, setModalData] = useState<any>(undefined);
  // Quản lý Xóa
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resC, resI] = await Promise.all([
        apiRequest(`/api/v1/cinemas/${id}`),
        apiRequest(`/api/v1/cinema-items`)
      ]);
      const dataC = await resC.json();
      const dataI = await resI.json();
      setCinema(dataC.data || dataC);
      setCinemaItems((dataI.data || dataI).filter((i: any) => i.cinemaId === Number(id) || i.cinema?.id === Number(id)));
    } catch (err) { toast.error("Lỗi đồng bộ"); } finally { setLoading(false); }
  };

  useEffect(() => { if (id) fetchData(); }, [id]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await apiRequest(`/api/v1/cinema-items/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Đã xóa phòng chiếu");
        setDeleteTarget(null);
        fetchData();
      }
    } catch (err) { toast.error("Không thể xóa"); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-red-600" size={32} />
      <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-600 italic">Hệ thống đang tải...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-red-600 tracking-tight">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.back()} className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-12 text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Quay lại hệ thống
        </button>

        <header className="flex flex-wrap justify-between items-end mb-16 gap-6">
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
              <p className="text-red-600 font-bold text-[10px] uppercase tracking-[0.3em]">Cấu hình Node</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.85] tracking-tighter">{cinema?.name}</h1>
            <div className="mt-6 flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase italic"><MapPin size={14} className="text-red-600" />{cinema?.address}</div>
          </div>
          <button onClick={() => setModalData(null)} className="px-8 py-5 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 shadow-xl active:scale-95">
            <Plus size={18} /> Thêm phòng mới
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cinemaItems.map((item) => (
            <div key={item.id} className="group relative bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 transition-all hover:border-red-600/40 hover:bg-zinc-900/60 overflow-hidden shadow-2xl">
              <div className="absolute -top-4 -left-2 text-7xl font-black text-white/[0.02] italic select-none">#0{item.id}</div>
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-red-600 transition-all duration-300"><Clapperboard size={22} /></div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button onClick={() => setModalData(item)} className="p-2.5 bg-white/10 hover:bg-white hover:text-black rounded-xl transition-all"><Edit3 size={15}/></button>
                  <button onClick={() => setDeleteTarget(item)} className="p-2.5 bg-white/10 hover:bg-red-600 hover:text-white rounded-xl transition-all"><Trash2 size={15}/></button>
                </div>
              </div>
              <div className="relative z-10 mb-8">
                <h3 className="text-2xl font-black uppercase italic truncate group-hover:text-red-500 transition-colors tracking-tight">{item.name}</h3>
                <div className="mt-4 space-y-1 text-zinc-500 font-bold uppercase text-[9px] tracking-widest italic">
                  <p className="flex items-center gap-2"><MapPin size={12} className="text-red-600" /> {item.city}</p>
                  <p className="flex items-center gap-2"><Clock size={12} className="text-red-600" /> {item.hoursPerRoom}h / ngày</p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-center opacity-50 group-hover:opacity-100 transition-opacity relative z-10">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Trạng thái: Sẵn sàng</span>
                <ChevronRight size={14} className="text-zinc-600 group-hover:text-red-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DÙNG CHUNG THÊM/SỬA */}
      <AddCinemaItemModal 
        isOpen={modalData !== undefined} 
        onClose={() => setModalData(undefined)} 
        cinemaId={Number(id)} 
        onSuccess={fetchData} 
        initialData={modalData} // Truyền dữ liệu cần sửa vào đây
      />

      {/* MODAL XÓA */}
      <ConfirmDeleteModal 
        isOpen={!!deleteTarget} 
        title={deleteTarget?.name} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={handleDelete} 
      />
    </div>
  );
}