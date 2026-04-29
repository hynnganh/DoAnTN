"use client";
import React, { useEffect, useState, useRef } from 'react';
import { X, Save, Sparkles, Upload, ChevronDown, Check, Film, MapPin, RefreshCw } from 'lucide-react';
import { apiRequest } from '@/app/lib/api';
import toast from 'react-hot-toast';

// --- THÀNH PHẦN CHỌN TÙY CHỈNH (Custom Select) ---
export const CustomSelect = ({ label, options, value, onChange, placeholder, icon: Icon }: any) => {
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
    <div className="space-y-2 relative text-left" ref={dropdownRef}>
      <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-[0.2em]">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-zinc-950/50 border backdrop-blur-sm ${isOpen ? 'border-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.05)]' : 'border-white/5'} p-4 rounded-2xl cursor-pointer flex justify-between items-center transition-all duration-500 hover:border-white/10`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={14} className={value !== 0 ? "text-red-500" : "text-zinc-600"} />}
          <span className={`text-[11px] font-bold ${value !== 0 ? 'text-zinc-100' : 'text-zinc-700'}`}>
            {selectedOption ? (selectedOption.title || selectedOption.name) : placeholder}
          </span>
        </div>
        <ChevronDown size={14} className={`text-zinc-600 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[120] top-[105%] left-0 right-0 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 max-h-48 overflow-y-auto"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{ __html: `
            .absolute::-webkit-scrollbar { display: none; }
          `}} />
          {options.map((opt: any) => (
            <div 
              key={opt.id}
              onClick={() => { onChange(opt.id); setIsOpen(false); }}
              className="px-5 py-3.5 flex justify-between items-center hover:bg-red-600/10 cursor-pointer transition-all duration-300 group"
            >
              <span className={`text-[11px] font-bold ${value === opt.id ? 'text-red-500' : 'text-zinc-400 group-hover:text-zinc-100'}`}>
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
  const [form, setForm] = useState({ title: "", content: "", movieId: 0, cinemaItemId: 0 });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    if (isOpen) {
      loadOptions();
      if (data) {
        setForm({ 
          title: data.title || "", 
          content: data.content || "", 
          movieId: data.movie?.id || 0, 
          cinemaItemId: data.cinemaItem?.id || 0 
        });
        const thumb = data.thumbnail;
        setPreviewUrl(thumb?.startsWith("/") ? `${API_BASE}${thumb}` : thumb || "");
      } else {
        setForm({ title: "", content: "", movieId: 0, cinemaItemId: 0 });
        setPreviewUrl("");
        setSelectedFile(null);
      }
    }
  }, [isOpen, data, API_BASE]);

  const loadOptions = async () => {
    try {
      const [mRes, cRes] = await Promise.all([apiRequest('/api/v1/movies'), apiRequest('/api/v1/cinema-items')]);
      const mJson = await mRes.json();
      const cJson = await cRes.json();
      setMovies([{ id: 0, title: "Tất cả phim" }, ...(mJson.data?.content || mJson.data || [])]);
      setCinemas([{ id: 0, name: "Toàn hệ thống" }, ...(cJson.data || [])]);
    } catch (e) { console.error("Lỗi tải tùy chọn", e); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if(!form.title) return toast.error("Vui lòng nhập tiêu đề");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("movieId", form.movieId.toString());
      formData.append("cinemaItemId", form.cinemaItemId.toString());
      if (selectedFile) formData.append("file", selectedFile);

      const isEdit = mode === 'edit';
      const url = isEdit ? `/api/v1/promotions/${data.id}` : '/api/v1/promotions';
      
      const res = await fetch(`${API_BASE}${url}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });

      if (res.ok) {
        toast.success(isEdit ? "Cập nhật thành công" : "Tạo mới thành công");
        onRefresh();
        onClose();
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Lỗi máy chủ");
      }
    } catch (e) {
      toast.error("Mất kết nối");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-full max-w-xl bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        
        {/* Tiêu đề Modal */}
        <div className="p-8 flex justify-between items-center border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-[1000] uppercase italic tracking-tighter text-white">
                {mode === 'edit' ? 'Cập Nhật Sự Kiện' : 'Tạo Chiến Dịch Mới'}
              </h2>
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-0.5">Xưởng Thiết Kế Khuyến Mãi</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-600 hover:text-white transition-all"><X size={20}/></button>
        </div>

        {/* Nội dung Modal - Fix triệt để thanh cuộn */}
        <div 
          className="flex-1 overflow-y-auto p-8 space-y-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Style nội bộ để ẩn thanh cuộn trên Chrome/Safari */}
          <style dangerouslySetInnerHTML={{ __html: `
            .overflow-y-auto::-webkit-scrollbar { display: none; }
          `}} />

          {/* Khu vực tải ảnh */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">Hình Ảnh Đại Diện</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`group relative aspect-[21/9] rounded-[2rem] overflow-hidden border transition-all duration-700 cursor-pointer flex items-center justify-center bg-zinc-900/30
                ${previewUrl ? 'border-white/10' : 'border-white/5 hover:border-red-600/30'}`}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Xem trước" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <Upload size={24} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="text-center group-hover:scale-110 transition-all duration-500">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload size={20} className="text-zinc-600 group-hover:text-red-500 transition-colors" />
                  </div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Nhấn để tải lên</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          {/* Các trường thông tin */}
          <div className="space-y-6">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Tên Chương Trình</label>
               <input 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
                className="w-full bg-zinc-950/50 border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600/50 transition-all duration-500 font-bold text-white text-sm placeholder:text-zinc-800" 
                placeholder="Nhập tên chiến dịch..." 
               />
             </div>
             
             <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Mô Tả Nội Dung</label>
               <textarea 
                value={form.content} 
                onChange={e => setForm({...form, content: e.target.value})} 
                rows={3} 
                className="w-full bg-zinc-950/50 border border-white/5 p-4 rounded-2xl outline-none focus:border-white/10 transition-all duration-500 text-xs text-zinc-400 placeholder:text-zinc-800 leading-relaxed" 
                placeholder="Viết lời dẫn hấp dẫn..." 
               />
             </div>

             <div className="grid grid-cols-2 gap-6 pt-2">
               <CustomSelect label="Phim Áp Dụng" options={movies} value={form.movieId} onChange={(id: any) => setForm({...form, movieId: id})} placeholder="Tất cả phim" icon={Film} />
               <CustomSelect label="Cơ Sở Rạp" options={cinemas} value={form.cinemaItemId} onChange={(id: any) => setForm({...form, cinemaItemId: id})} placeholder="Toàn hệ thống" icon={MapPin} />
             </div>
          </div>
        </div>

        {/* Nút điều hướng chân trang */}
        <div className="p-8 flex gap-4 bg-zinc-950/80 border-t border-white/5 shrink-0">
          <button onClick={onClose} className="px-8 py-4 text-zinc-600 hover:text-white font-black uppercase text-[10px] tracking-[0.2em] transition-colors">Hủy Bỏ</button>
          <button 
            onClick={handleSave} 
            disabled={isSubmitting} 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-[1000] uppercase text-[11px] tracking-[0.3em] flex justify-center items-center gap-3 shadow-2xl shadow-red-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <RefreshCw className="animate-spin" size={16}/>
            ) : (
              <>
                <Save size={16} className="opacity-50" />
                {mode === 'edit' ? 'Cập Nhật Ngay' : 'Xác Nhận Tạo'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}