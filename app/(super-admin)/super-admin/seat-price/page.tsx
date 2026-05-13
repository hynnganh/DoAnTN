"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Loader2,
  Armchair,
  Edit3,
  CalendarDays,
  TrendingUp,
  Settings2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { PriceActionModal } from "./PriceActionModal";

const DAYS: Record<number, string> = {
  2: "Thứ 2",
  3: "Thứ 3",
  4: "Thứ 4",
  5: "Thứ 5",
  6: "Thứ 6",
  7: "Thứ 7",
  8: "Chủ Nhật",
};

export default function PriceManagementPage() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/api/v1/seat-price-configs");
      const json = await res.json();
      if (res.ok) setPrices(json?.data ?? []);
      else toast.error(json?.message || "Lỗi tải dữ liệu");
    } catch (err) {
      toast.error("Không thể kết nối Server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrices(); }, []);

  const groupedPrices = useMemo(() => {
    const groups: Record<string, any[]> = {};
    prices.forEach((item) => {
      if (!groups[item.seatType]) groups[item.seatType] = [];
      groups[item.seatType].push(item);
    });
    Object.keys(groups).forEach((type) => {
      groups[type].sort((a, b) => Number(a.dayOfWeek) - Number(b.dayOfWeek));
    });
    return groups;
  }, [prices]);

  const handleSave = async (formData: any) => {
    const payload = {
      seatType: formData.seatType,
      dayOfWeek: Number(formData.dayOfWeek),
      price: Number(formData.price),
    };
    const method = selectedItem?.id ? "PUT" : "POST";
    const url = selectedItem?.id
      ? `/api/v1/seat-price-configs/${selectedItem.id}`
      : "/api/v1/seat-price-configs";

    try {
      const res = await apiRequest(url, { method, body: JSON.stringify(payload) });
      const json = await res.json();
      if (res.ok) {
        toast.success(selectedItem?.id ? "Cập nhật thành công" : "Thiết lập thành công");
        fetchPrices();
        setIsActionOpen(false);
        setSelectedItem(null);
      } else {
        toast.error(json?.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Lỗi hệ thống");
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 p-6 md:p-12 font-sans selection:bg-red-500/30">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } }} />

      {/* HEADER CẢI TIẾN */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-600 font-bold tracking-widest uppercase text-xs">
            <Settings2 size={14} />
            <span>Management Studio</span>
          </div>
          <h1 className="text-5xl font-[1000] uppercase italic tracking-tighter leading-none">
            BẢNG GIÁ <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">HỆ THỐNG</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-md text-sm">
            Tối ưu hóa doanh thu bằng cách cấu hình giá vé linh hoạt cho từng loại ghế và thời điểm trong tuần.
          </p>
        </div>

        <button
          onClick={() => { setSelectedItem(null); setIsActionOpen(true); }}
          className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:pr-12 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-red-600 hover:text-white"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus size={16} strokeWidth={3} />
            Thiết lập mới
          </span>
          <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all">
             <TrendingUp size={16} />
          </div>
        </button>
      </header>

      {/* LOADING STATE */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="animate-spin text-red-600" size={48} />
          <span className="text-zinc-500 animate-pulse font-bold tracking-widest text-[10px] uppercase">Đang đồng bộ dữ liệu...</span>
        </div>
      ) : (
        <div className="space-y-20">
          {Object.entries(groupedPrices).map(([seatType, items]: [string, any[]]) => (
            <section key={seatType} className="relative group/section">
              {/* PHÂN CÁCH LOẠI GHẾ */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/5 px-5 py-2.5 rounded-full shadow-inner">
                  <Armchair className="text-red-600" size={20} />
                  <h2 className="text-xl font-[900] uppercase tracking-tight">
                    {seatType}
                  </h2>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
              </div>

              {/* GRID HIỂN THỊ DẠNG CARD MỚI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
                {items.map((item) => {
                  const isHighPrice = item.price >= 100000;
                  return (
                    <div
                      key={item.id}
                      className="group relative bg-zinc-900/30 border border-white/5 p-6 rounded-[2rem] transition-all duration-500 hover:bg-zinc-800/50 hover:border-red-600/50 hover:-translate-y-2 shadow-xl"
                    >
                      {/* Dải màu đánh dấu giá */}
                      <div className={`absolute top-6 left-0 w-1 h-8 rounded-r-full transition-colors ${isHighPrice ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-zinc-700'}`} />

                      <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Timeline</span>
                           <span className="text-sm font-bold text-white">
                             {DAYS[item.dayOfWeek] ?? "---"}
                           </span>
                        </div>
                        
                        <button
                          onClick={() => { setSelectedItem(item); setIsActionOpen(true); }}
                          className="opacity-0 group-hover:opacity-100 p-2.5 bg-zinc-800 border border-white/10 rounded-xl hover:bg-red-600 hover:text-white transition-all transform scale-75 group-hover:scale-100"
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>

                      <div className="relative">
                        <span className="text-[10px] font-black text-red-600/80 uppercase block mb-1 tracking-tighter">Đơn giá áp dụng</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-[1000] italic tracking-tighter text-white">
                            {(item.price / 1000).toLocaleString()}
                          </span>
                          <span className="text-lg font-black italic text-zinc-600">K</span>
                        </div>
                      </div>

                      {/* Decor element */}
                      <CalendarDays className="absolute bottom-6 right-6 text-white/5 group-hover:text-red-600/10 transition-colors" size={40} />
                    </div>
                  );
                })}

                {/* QUICK ADD CARD */}
                <button
                  onClick={() => { setSelectedItem({ seatType }); setIsActionOpen(true); }}
                  className="group/add relative border-2 border-dashed border-zinc-800 rounded-[2rem] min-h-[160px] flex flex-col justify-center items-center transition-all hover:bg-zinc-900/50 hover:border-red-600/30"
                >
                  <div className="p-3 rounded-full bg-zinc-900 group-hover/add:bg-red-600 transition-colors">
                    <Plus size={24} className="group-hover/add:rotate-90 transition-transform duration-300" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest mt-4 text-zinc-500 group-hover/add:text-white">Thêm ngày</span>
                </button>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* MODAL */}
      <PriceActionModal
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
        onSave={handleSave}
        initialData={selectedItem}
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}