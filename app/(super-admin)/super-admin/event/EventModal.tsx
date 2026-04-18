"use client";
import React, { useEffect, useState, useRef } from 'react';
import { X, Save, Loader2, Sparkles, Image as ImageIcon, Link, ChevronRight, ChevronDown, Check, Film, MapPin } from 'lucide-react';
import { apiRequest } from '@/app/lib/api';
import toast from 'react-hot-toast';

// --- CUSTOM DROPDOWN COMPONENT ---
const CustomSelect = ({ label, options, value, onChange, placeholder, icon: Icon }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt: any) => opt.id === value);

  return (
    <div className="space-y-1.5 relative" ref={dropdownRef}>
      <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-zinc-900/50 border ${isOpen ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'border-white/5'} p-3 rounded-xl cursor-pointer flex justify-between items-center transition-all`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className={value !== 0 ? "text-red-500" : "text-zinc-600"} />}
          <span className={`text-[11px] font-bold ${value !== 0 ? 'text-zinc-100' : 'text-zinc-500'}`}>
            {selectedOption ? (selectedOption.title || selectedOption.name) : placeholder}
          </span>
        </div>
        <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[120] top-[110%] left-0 right-0 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-48 overflow-y-auto scrollbar-hide">
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          {options.map((opt: any) => (
            <div 
              key={opt.id}
              onClick={() => { onChange(opt.id); setIsOpen(false); }}
              className="px-4 py-2.5 flex justify-between items-center hover:bg-white/5 cursor-pointer transition-colors group"
            >
              <span className={`text-[11px] font-bold ${value === opt.id ? 'text-red-500' : 'text-zinc-400 group-hover:text-white'}`}>
                {opt.title || opt.name}
              </span>
              {value === opt.id && <Check size={12} className="text-red-500" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function PromotionModal({ isOpen, mode, data, onClose, onRefresh }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", content: "", image: "", movieId: 0, cinemaItemId: 0 });

  useEffect(() => {
    if (isOpen) {
      const loadOptions = async () => {
        try {
          const [mRes, cRes] = await Promise.all([apiRequest('/api/v1/movies'), apiRequest('/api/v1/cinema-items')]);
          const mJson = await mRes.json();
          const cJson = await cRes.json();
          const movieData = mJson.data?.content || (Array.isArray(mJson.data) ? mJson.data : []);
          const cinemaData = Array.isArray(cJson.data) ? cJson.data : [];
          setMovies([{ id: 0, title: "Tất cả phim" }, ...movieData]);
          setCinemas([{ id: 0, name: "Toàn hệ thống" }, ...cinemaData]);
        } catch (e) {
          setMovies([{ id: 0, title: "Tất cả phim" }]);
          setCinemas([{ id: 0, name: "Toàn hệ thống" }]);
        }
      };
      loadOptions();
      if (data) {
        setForm({ title: data.title, content: data.content, image: data.thumbnail, movieId: data.movie?.id || 0, cinemaItemId: data.cinemaItem?.id || 0 });
      } else {
        setForm({ title: "", content: "", image: "", movieId: 0, cinemaItemId: 0 });
      }
    }
  }, [isOpen, data]);

  const handleSave = async () => {
    if(!form.title) return toast.error("Vui lòng nhập tiêu đề sự kiện");
    setIsSubmitting(true);
    try {
      const isEdit = mode === 'edit';
      const url = isEdit ? `/api/v1/promotions/${data.id}` : '/api/v1/promotions';
      const res = await apiRequest(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify({ ...form, movieId: Number(form.movieId), cinemaItemId: Number(form.cinemaItemId) })
      } as any);
      if (res.ok) {
        toast.success(isEdit ? "Cập nhật thành công!" : "Đã phát hành sự kiện!");
        onRefresh();
        onClose();
      }
    } catch (e) { toast.error("Lỗi kết nối máy chủ"); }
    finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header - Fixed Sự kiện */}
        <div className="p-6 flex justify-between items-center border-b border-white/5 bg-zinc-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600 rounded-xl shadow-lg shadow-red-600/20">
              <Sparkles className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-base font-black uppercase italic tracking-tight text-white">Quản lý sự kiện</h2>
              <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                {mode === 'edit' ? 'Cập nhật thông tin' : 'Tạo mới sự kiện'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all">
            <X size={20}/>
          </button>
        </div>

        {/* Body - Ẩn thanh cuộn */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          
          <div className="space-y-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Tên sự kiện</label>
                <input 
                  value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/5 p-3 rounded-xl outline-none focus:border-red-600 transition-all font-bold text-white text-xs"
                  placeholder="Vd: Big Sale 12.12..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Nội dung sự kiện</label>
                <textarea 
                  value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                  rows={2}
                  className="w-full bg-zinc-900/50 border border-white/5 p-3 rounded-xl outline-none focus:border-red-600 transition-all text-xs text-zinc-400"
                  placeholder="Chi tiết chương trình ưu đãi..."
                />
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomSelect label="Phim áp dụng" options={movies} value={form.movieId} onChange={(id: any) => setForm({...form, movieId: id})} placeholder="Chọn phim" icon={Film} />
            <CustomSelect label="Rạp áp dụng" options={cinemas} value={form.cinemaItemId} onChange={(id: any) => setForm({...form, cinemaItemId: id})} placeholder="Chọn rạp" icon={MapPin} />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Hình ảnh Poster</label>
            <div className="relative aspect-video bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/5">
              {form.image ? (
                <img src={form.image} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-800 border-2 border-dashed border-zinc-900">
                  <ImageIcon size={24} />
                  <p className="text-[7px] font-black uppercase mt-1 tracking-widest">No Poster Preview</p>
                </div>
              )}
            </div>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={12} />
              <input 
                value={form.image} onChange={e => setForm({...form, image: e.target.value})}
                className="w-full bg-zinc-900/50 border border-white/5 pl-9 pr-3 py-3 rounded-xl outline-none focus:border-red-600 text-[10px] font-mono text-zinc-500 transition-all"
                placeholder="Link ảnh (JPG, PNG)..."
              />
            </div>
          </div>
        </div>

        {/* Footer - Fixed Sự kiện */}
        <div className="p-6 border-t border-white/5 bg-zinc-900/20 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl font-bold uppercase text-[10px] tracking-widest text-zinc-400 hover:bg-white/5 transition-all"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleSave} disabled={isSubmitting}
            className="flex-[2] bg-red-600 text-white py-3.5 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-700 transition-all flex justify-center items-center gap-2 shadow-xl shadow-red-600/10 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
            {mode === 'edit' ? 'Lưu sự kiện' : 'Công bố sự kiện'}
          </button>
        </div>
      </div>
    </div>
  );
}