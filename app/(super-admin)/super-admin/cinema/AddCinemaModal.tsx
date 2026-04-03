"use client";
import React, { useState } from 'react';
import { X, Zap, ChevronRight, Loader2, Building2, MapPin, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiRequest } from '@/app/lib/api';
import { ShieldCheck } from 'lucide-react';
interface AddCinemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCinemaModal({ isOpen, onClose, onSuccess }: AddCinemaModalProps) {
  const [cinemaName, setCinemaName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cinemaName.trim()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Đang đồng bộ hạt nhân...");

    try {
      const res = await apiRequest('/api/v1/cinemas', {
        method: 'POST',
        body: JSON.stringify({ 
          name: cinemaName,
          address: "Quận",
          city: "TP. Hồ Chí Minh",
          description: "Chi nhánh rạp mới khởi tạo"
        })
      });

      const result = await res.json();

      if (res.ok || result.status === 201) {
        toast.success(`Kích hoạt thành công: ${cinemaName}`, { id: loadingToast });
        setCinemaName("");
        onSuccess(); 
        onClose();   
      } else {
        toast.error(result.message || "Lỗi lưu trữ!", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Lỗi kết nối API!", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-500"
      onClick={onClose}
    >
      {/* Side Panel */}
      <div 
        className="w-full max-w-[450px] bg-[#080808]/90 backdrop-blur-3xl border-l border-white/10 h-screen shadow-[-20px_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-500 flex flex-col"
        onClick={(e) => e.stopPropagation()} // Ngăn đóng modal khi nhấn vào panel
      >
        {/* Header Panel */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tight text-white">New Node</h2>
              <p className="text-[9px] font-bold text-red-600 uppercase tracking-[0.3em]">Cấu hình rạp mới</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content Panel */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <div className="space-y-2">
            <p className="text-zinc-500 text-xs font-medium leading-relaxed">
              Vui lòng nhập tên định danh cho chi nhánh mới. Hệ thống sẽ tự động phân bổ tài nguyên Cloud cho Node này.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Input Group */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                <Building2 size={12} className="text-red-600" /> Tên chi nhánh
              </label>
              <div className="relative group">
                <input 
                  autoFocus
                  type="text"
                  placeholder="VD: CN_Quận1" 
                  value={cinemaName}
                  disabled={isSubmitting}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-lg font-bold text-white outline-none focus:border-red-600/50 focus:bg-white/[0.05] transition-all placeholder:text-zinc-700"
                  onChange={e => setCinemaName(e.target.value)}
                  required
                />
                {/* Glow effect on focus */}
                <div className="absolute inset-0 rounded-2xl bg-red-600/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>

            {/* Read-only Info (Mockup cho đẹp) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                  <MapPin size={10} /> Location
                </div>
                <p className="text-xs font-bold text-zinc-300 italic">TP. Hồ Chí Minh</p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                  <Info size={10} /> Status
                </div>
                <p className="text-xs font-bold text-green-500 italic">Ready to Sync</p>
              </div>
            </div>

            <div className="pt-10">
              <button 
                type="submit" 
                disabled={!cinemaName.trim() || isSubmitting}
                className="w-full group relative overflow-hidden bg-white text-black py-6 rounded-2xl font-[1000] uppercase text-[11px] tracking-[0.2em] shadow-2xl transition-all hover:bg-red-600 hover:text-white active:scale-95 disabled:opacity-20"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Khởi tạo chi nhánh <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Panel */}
        <div className="p-8 border-t border-white/5 bg-black/20">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-600/10 rounded-lg">
              <ShieldCheck size={16} className="text-red-600" />
            </div>
            <p className="text-[10px] text-zinc-600 leading-relaxed font-medium">
              Thao tác này sẽ ghi đè vào cơ sở dữ liệu cốt lõi. Hãy đảm bảo tên rạp không trùng lặp để tránh xung đột định danh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
