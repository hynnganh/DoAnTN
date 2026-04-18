"use client";
import React, { useEffect, useState } from 'react';
import { X, Save, Loader2, Calendar, Tag, DollarSign, Activity, FileText, MapPin, Star, ChevronDown } from 'lucide-react';
import { apiRequest } from '@/app/lib/api'; 
import toast from 'react-hot-toast';

export default function VoucherModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: any) {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [formData, setFormData] = useState({
    code: "", title: "", description: "", discountValue: 0,
    minOrderAmount: 0, usageLimit: 1,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    cinemaItemId: "", promotionId: ""
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          const [promoRes, cinemaRes] = await Promise.all([
            apiRequest('/api/v1/promotions'),
            apiRequest('/api/v1/cinemas')
          ]);
          if (promoRes.ok) setPromotions((await promoRes.json()).data || []);
          if (cinemaRes.ok) setCinemas((await cinemaRes.json()).data || []);
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        ...initialData,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : "",
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : "",
        cinemaItemId: initialData.cinemaItem?.id || initialData.cinemaItemId || "",
        promotionId: initialData.promotion?.id || initialData.promotionId || ""
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      {/* Container thu gọn: max-w-xl (600px) */}
      <div className="relative bg-[#0d0d0d] border border-white/10 p-6 md:p-8 rounded-[2.5rem] max-w-xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Header tinh giản */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              {initialData ? 'Edit' : 'New'} <span className="text-red-600">Voucher</span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${loadingData ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                {loadingData ? "Syncing data..." : "Ready to config"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-red-600/20 hover:text-red-500 rounded-xl transition-all">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-500 ml-1 tracking-widest flex items-center gap-1.5"><Tag size={10} /> Mã Code</label>
              <input name="code" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full bg-zinc-900 border border-white/5 p-3 rounded-xl text-white text-sm font-bold outline-none focus:border-red-600/40 transition-all" placeholder="GIAM50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-500 ml-1 tracking-widest flex items-center gap-1.5"><Activity size={10} /> Lượt dùng</label>
              <input name="usageLimit" type="number" required value={formData.usageLimit} onChange={handleChange}
                className="w-full bg-zinc-900 border border-white/5 p-3 rounded-xl text-white text-sm font-bold outline-none focus:border-red-600/40" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-zinc-500 ml-1 tracking-widest">Tên Voucher</label>
            <input name="title" required value={formData.title} onChange={handleChange}
              className="w-full bg-zinc-900 border border-white/5 p-3 rounded-xl text-white text-sm font-bold outline-none focus:border-red-600/40" placeholder="Ưu đãi hè rực rỡ..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-500 ml-1 tracking-widest flex items-center gap-1.5"><DollarSign size={10} className="text-red-600"/> Giảm giá</label>
              <input name="discountValue" type="number" required value={formData.discountValue} onChange={handleChange}
                className="w-full bg-zinc-900 border border-white/5 p-3 rounded-xl text-white text-sm font-bold outline-none focus:border-red-600/40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-500 ml-1 tracking-widest">Đơn tối thiểu</label>
              <input name="minOrderAmount" type="number" required value={formData.minOrderAmount} onChange={handleChange}
                className="w-full bg-zinc-900 border border-white/5 p-3 rounded-xl text-white text-sm font-bold outline-none focus:border-red-600/40" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-500 ml-1 tracking-widest flex items-center gap-1.5"><Star size={10} className="text-yellow-500"/> Sự kiện</label>
              <div className="relative">
                <select name="promotionId" value={formData.promotionId} onChange={handleChange}
                  className="w-full bg-zinc-900 border border-white/5 p-3 rounded-xl text-white text-xs font-bold outline-none appearance-none cursor-pointer">
                  <option value="">Cá nhân</option>
                  {promotions.map(p => <option key={p.id} value={p.id} className="bg-zinc-950">{p.title}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={14} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-500 ml-1 tracking-widest flex items-center gap-1.5"><MapPin size={10} className="text-red-600"/> Rạp áp dụng</label>
              <div className="relative">
                <select name="cinemaItemId" value={formData.cinemaItemId} onChange={handleChange}
                  className="w-full bg-zinc-900 border border-white/5 p-3 rounded-xl text-white text-xs font-bold outline-none appearance-none cursor-pointer">
                  <option value="">Toàn quốc</option>
                  {cinemas.map(c => <option key={c.id} value={c.id} className="bg-zinc-950">{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-500 ml-1 tracking-widest">Bắt đầu</label>
              <input name="startDate" type="datetime-local" required value={formData.startDate} onChange={handleChange}
                className="w-full bg-zinc-900 border border-white/5 p-3 rounded-xl text-[11px] text-white font-bold outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-500 ml-1 tracking-widest">Kết thúc</label>
              <input name="endDate" type="datetime-local" required value={formData.endDate} onChange={handleChange}
                className="w-full bg-zinc-900 border border-white/5 p-3 rounded-xl text-[11px] text-white font-bold outline-none" />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSubmitting || loadingData}
              className="w-full bg-white hover:bg-red-600 text-black hover:text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-[0.97] disabled:opacity-50 shadow-lg shadow-white/5">
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> {initialData ? "Save Update" : "Create Now"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}