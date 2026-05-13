"use client";

import React, { useEffect, useState } from "react";
import { X, Save, Armchair, Calendar, Banknote, Sparkles, AlertCircle } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const DAYS = [
  { value: 2, label: "Thứ Hai" },
  { value: 3, label: "Thứ Ba" },
  { value: 4, label: "Thứ Tư" },
  { value: 5, label: "Thứ Năm" },
  { value: 6, label: "Thứ Sáu" },
  { value: 7, label: "Thứ Bảy" },
  { value: 8, label: "Chủ Nhật" },
];

const SEAT_TYPES = ["NORMAL", "VIP", "COUPLE"];

export function PriceActionModal({ isOpen, onClose, onSave, initialData }: ModalProps) {
  const [formData, setFormData] = useState({
    seatType: "NORMAL",
    dayOfWeek: 2,
    price: 0,
  });

  // Quản lý trạng thái lỗi
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setError(null); // Reset lỗi khi đóng modal
      return;
    }

    if (initialData) {
      setFormData({
        seatType: initialData.seatType || "NORMAL",
        dayOfWeek: Number(initialData.dayOfWeek) || 2,
        price: Number(initialData.price) || 0,
      });
    } else {
      setFormData({ seatType: "NORMAL", dayOfWeek: 2, price: 0 });
    }
  }, [initialData, isOpen]);

  // Hàm kiểm tra ràng buộc trước khi Save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.price <= 0) {
      setError("Giá vé phải lớn hơn 0 VNĐ");
      return;
    }

    if (formData.price > 2000000) { // Ví dụ: Giới hạn giá tối đa 2 triệu
      setError("Giá vé không được vượt quá 2.000.000 VNĐ");
      return;
    }

    setError(null);
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden relative">
        
        {/* HEADER */}
        <div className="px-10 pt-10 pb-6 flex justify-between items-center relative">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
              <Sparkles size={12} />
              <span>Strict Mode On</span>
            </div>
            <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter text-white">
              {initialData?.id ? "Cập nhật" : "Thiết lập"} <span className="text-red-600">Giá</span>
            </h2>
          </div>
          <button onClick={onClose} className="p-3 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-red-600 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form className="px-10 pb-12 space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* SEAT TYPE */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Armchair size={12} /> Loại ghế
              </label>
              <select
                value={formData.seatType}
                onChange={(e) => setFormData({ ...formData, seatType: e.target.value })}
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-4 py-4 text-xs font-bold text-white outline-none focus:border-red-600/50 appearance-none"
              >
                {SEAT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            {/* DAY OF WEEK */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={12} /> Ngày
              </label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-4 py-4 text-xs font-bold text-white outline-none focus:border-red-600/50 appearance-none"
              >
                {DAYS.map((day) => <option key={day.value} value={day.value}>{day.label}</option>)}
              </select>
            </div>
          </div>

          {/* PRICE INPUT + VALIDATION */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Banknote size={12} /> Giá vé niêm yết
            </label>
            <div className="relative group">
              <input
                type="number"
                value={formData.price || ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({ ...formData, price: val });
                  if (val > 0) setError(null); // Xóa lỗi ngay khi người dùng nhập đúng
                }}
                className={`w-full bg-zinc-900/80 border-2 rounded-[2rem] px-8 py-6 text-4xl font-[1000] italic outline-none transition-all ${
                  error ? "border-red-600 animate-shake" : "border-white/5 focus:border-red-600"
                } ${formData.price > 0 ? "text-red-600" : "text-zinc-600"}`}
                placeholder="0"
                onFocus={(e) => e.target.select()}
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-700 font-black italic">VND</div>
            </div>
            
            {/* THÔNG BÁO LỖI */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider mt-2 ml-4 animate-in slide-in-from-top-1">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={formData.price <= 0}
            className={`w-full py-5 rounded-[2rem] font-[1000] uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-2xl ${
              formData.price > 0 
                ? "bg-white text-black hover:bg-red-600 hover:text-white active:scale-[0.98]" 
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            <Save size={18} strokeWidth={3} />
            {initialData?.id ? "Cập nhật ngay" : "Kích hoạt giá"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
}