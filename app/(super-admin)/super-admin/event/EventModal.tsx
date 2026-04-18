"use client";
import React, { useEffect, useState } from 'react';
import { X, Save, Loader2, Sparkles, Image as ImageIcon, Link } from 'lucide-react';
import { apiRequest } from '@/app/lib/api';
import toast from 'react-hot-toast';

export default function PromotionModal({ isOpen, mode, data, onClose, onRefresh }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", content: "", image: "", movieId: 0, cinemaItemId: 0 });

  useEffect(() => {
    if (isOpen) {
      const loadOptions = async () => {
        try {
          const [mRes, cRes] = await Promise.all([apiRequest('/api/v1/movies'), apiRequest('/api/v1/cinemas')]);
          const mJson = await mRes.json();
          const cJson = await cRes.json();
          setMovies(Array.isArray(mJson.data) ? mJson.data : []);
          setCinemas(Array.isArray(cJson.data) ? cJson.data : []);
        } catch (e) { setMovies([]); setCinemas([]); }
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
    if(!form.title) return toast.error("Vui lòng nhập tiêu đề");
    setIsSubmitting(true);
    try {
      const isEdit = mode === 'edit';
      const url = isEdit ? `/api/v1/promotions/${data.id}` : '/api/v1/promotions';
      const res = await apiRequest(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify({ ...form, movieId: Number(form.movieId), cinemaItemId: Number(form.cinemaItemId) })
      } as any);

      if (res.ok) {
        toast.success("Đã cập nhật chiến dịch");
        onRefresh();
        onClose();
      }
    } catch (e) { toast.error("Lỗi server"); }
    finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/80 backdrop-blur-sm transition-all duration-500">
      <div className="w-full max-w-xl bg-zinc-950 h-full border-l border-white/5 flex flex-col animate-in slide-in-from-right duration-500">
        {/* Header */}
        <div className="p-8 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-3">
            <Sparkles className="text-red-600" />
            <h2 className="text-lg font-black uppercase italic tracking-tighter">Campaign Configuration</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-xl transition-all"><X size={20}/></button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em]">Tiêu đề hiển thị</label>
              <input 
                value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 font-bold uppercase tracking-tight italic text-lg"
                placeholder="VD: GIẢM 50% COMBO BẮP NƯỚC..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em]">Chi tiết ưu đãi</label>
              <textarea 
                value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                rows={4}
                className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 text-sm leading-relaxed text-zinc-400"
                placeholder="Nhập nội dung chi tiết..."
              />
            </div>
          </div>

          {/* Section 2: Scoping (Nghiệp vụ quan trọng) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em]">Phim liên kết</label>
              <select 
                value={form.movieId} onChange={e => setForm({...form, movieId: Number(e.target.value)})}
                className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-2xl outline-none text-xs font-bold appearance-none cursor-pointer"
              >
                <option value={0}>Tất cả phim</option>
                {movies.map((m: any) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em]">Rạp áp dụng</label>
              <select 
                value={form.cinemaItemId} onChange={e => setForm({...form, cinemaItemId: Number(e.target.value)})}
                className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-2xl outline-none text-xs font-bold appearance-none cursor-pointer"
              >
                <option value={0}>Toàn hệ thống</option>
                {cinemas.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Section 3: Media */}
          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em] flex items-center gap-2">
              <ImageIcon size={14}/> Hình ảnh đại diện (URL)
            </label>
            <div className="relative group aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden border-2 border-dashed border-zinc-800 hover:border-red-600 transition-all">
              {form.image ? (
                <img src={form.image} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
                  <Link size={24} />
                  <span className="text-[8px] font-black uppercase mt-2">Dán Link ảnh vào ô bên dưới</span>
                </div>
              )}
            </div>
            <input 
              value={form.image} onChange={e => setForm({...form, image: e.target.value})}
              className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 text-[10px] font-mono"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-zinc-900/20">
          <button 
            onClick={handleSave} disabled={isSubmitting}
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase italic tracking-tighter hover:bg-red-600 hover:text-white transition-all flex justify-center items-center gap-2 active:scale-95"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
            Deploy Campaign
          </button>
        </div>
      </div>
    </div>
  );
}