"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Box, Zap, Edit2, Trash2, 
  Loader2, ImageIcon, Package, X, Save, AlertCircle
} from 'lucide-react';
import { apiRequest } from '@/app/lib/api';
import toast from 'react-hot-toast';

interface ComboDTO {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

export default function FoodManagement() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States cho Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState<ComboDTO>({
    name: '',
    description: '',
    imageUrl: '',
    price: 0
  });

  const fetchCombos = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/api/v1/combos');
      const result = await res.json();
      setCombos(result.data || result); 
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCombos(); }, []);

  // --- XỬ LÝ XÓA (FIX LẠI KHÔNG DÙNG WINDOW.CONFIRM) ---
  const triggerDelete = (id: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const toastId = toast.loading("Đang loại bỏ combo...");
    try {
      const res = await apiRequest(`/api/v1/combos/${itemToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Xóa thành công!", { id: toastId });
        setIsDeleteModalOpen(false);
        fetchCombos();
      } else {
        toast.error("Không thể xóa lúc này!", { id: toastId });
      }
    } catch (e) { toast.error("Lỗi hệ thống!", { id: toastId }); }
  };

  // --- THÊM RÀNG BUỘC KHI SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ràng buộc dữ liệu nhẹ ở Frontend
    if (formData.name.trim().length < 3) return toast.error("Tên combo phải ít nhất 3 ký tự!");
    if (formData.price <= 0) return toast.error("Giá bán phải lớn hơn 0!");

    const isUpdate = !!editingItem;
    const endpoint = isUpdate ? `/api/v1/combos/${editingItem.id}` : '/api/v1/combos';
    
    const toastId = toast.loading(isUpdate ? "Đang cập nhật..." : "Đang tạo mới...");
    try {
      const res = await apiRequest(endpoint, {
        method: isUpdate ? 'PUT' : 'POST',
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success(isUpdate ? "Cập nhật thành công!" : "Đã thêm combo!", { id: toastId });
        setIsModalOpen(false);
        fetchCombos();
      } else {
        const err = await res.json();
        toast.error(err.message || "Thao tác thất bại!", { id: toastId });
      }
    } catch (e) { toast.error("Lỗi kết nối API!", { id: toastId }); }
  };

  const openModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ 
        name: item.name, 
        description: item.description || '', 
        price: item.price, 
        imageUrl: item.imageUrl || '' 
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', price: 0, imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const filteredItems = combos.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 p-2 md:p-6 no-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter text-white">
            QUẢN LÝ <span className="text-red-600">COMBO & ĐỒ ĂN</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">
            A&K Cinema / F&B Internal Core
          </p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 active:scale-95 w-fit">
          <Plus size={16} /> Tạo Combo Mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Tổng Combo" value={combos.length.toString()} icon={<Box size={20}/>} color="text-blue-500" />
        <StatCard title="Trạng thái" value="Live" icon={<Zap size={20}/>} color="text-amber-500" />
        <StatCard title="Giá cao nhất" value={combos.length > 0 ? `${Math.max(...combos.map(o => o.price || 0)).toLocaleString()}đ` : "0đ"} icon={<Package size={20}/>} color="text-red-500" />
      </div>

      {/* Table Section */}
      <div className="bg-zinc-900/30 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-white/5">
           <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm kiếm nhanh..." className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-xs outline-none focus:border-red-600/30 transition-all text-white font-bold" />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-red-600" size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic tracking-[0.3em]">Syncing...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-white/5">
                  <th className="px-8 py-5">Sản phẩm</th>
                  <th className="px-6 py-5">Chi tiết</th>
                  <th className="px-6 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/5 overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                          {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <ImageIcon size={20} className="text-zinc-700" />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white leading-none mb-1 uppercase italic tracking-tight">{item.name}</p>
                          <p className="text-[11px] text-red-600 font-black italic tracking-tighter">{item.price?.toLocaleString()}đ</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-[250px]">
                      <p className="text-[11px] text-zinc-500 italic line-clamp-2 leading-relaxed font-medium">
                        {item.description || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all">
                        <button onClick={() => openModal(item)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all"><Edit2 size={14} /></button>
                        <button onClick={() => triggerDelete(item.id)} className="p-2.5 bg-red-600/5 hover:bg-red-600/20 rounded-xl text-zinc-500 hover:text-red-600 transition-all"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- MODAL THÊM / SỬA (CÓ RÀNG BUỘC HTML5) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-white/10 rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-xl font-[1000] text-white uppercase italic tracking-tighter">
                {editingItem ? 'Update' : 'Create'} <span className="text-red-600">Combo</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Tên sản phẩm</label>
                  <input required minLength={3} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm outline-none focus:border-red-600/50 text-white font-bold italic" placeholder="Nhập tên combo..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Giá bán (VNĐ)</label>
                  <input required type="number" min={1000} value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm outline-none focus:border-red-600/50 text-white font-mono font-black" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">URL Hình ảnh</label>
                  <input required type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm outline-none focus:border-red-600/50 text-white font-medium" placeholder="https://..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Mô tả</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm outline-none focus:border-red-600/50 text-white resize-none italic font-medium" placeholder="Chi tiết..." />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-white text-black rounded-2xl font-[1000] text-[11px] uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 shadow-xl shadow-white/5">
                <Save size={14} /> {editingItem ? 'Lưu cập nhật' : 'Xác nhận tạo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- CUSTOM DELETE MODAL (BÀ CẦN CÁI NÀY ĐỂ FIX "LOCALHOST SAYS") --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-600/10 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-[1000] text-white uppercase italic tracking-tighter mb-2">
                Xác nhận <span className="text-red-600">Xóa?</span>
              </h2>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed italic px-4">
                Dữ liệu sẽ bị gỡ khỏi hệ thống vĩnh viễn. Bà có chắc chắn không?
              </p>
            </div>
            
            <div className="flex border-t border-white/5">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white/[0.02] transition-all"
              >
                Hủy
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white transition-all border-l border-white/5"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-[32px] relative overflow-hidden group hover:border-white/10 transition-all">
      <div className={`p-3 rounded-2xl bg-black/40 w-fit mb-4 ${color} group-hover:scale-110 transition-transform relative z-10`}>{icon}</div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{title}</p>
        <h3 className="text-3xl font-[1000] text-white italic tracking-tighter">{value}</h3>
      </div>
      <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500">
        {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 100, strokeWidth: 1 })}
      </div>
    </div>
  );
}