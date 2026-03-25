"use client";

import React, { useState, useEffect } from 'react';
import { 
  Ticket, Edit3, Save, X, Plus, 
  TrendingUp, DollarSign, Loader2, Trash2 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PriceManagementPage() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  // --- CALL API LẤY BẢNG GIÁ ---
  const fetchPrices = async () => {
    try {
      setLoading(true);
      // Giả sử bà có endpoint /api/v1/prices
      const res = await fetch('http://localhost:8080/api/v1/prices');
      const result = await res.json();
      if (res.ok) {
        setPrices(result.data || []);
      }
    } catch (err) {
      console.log("Lỗi kết nối BE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrices(); }, []);

  // --- HÀM CẬP NHẬT GIÁ NHANH ---
  const handleUpdatePrice = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/prices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: editValue })
      });
      if (res.ok) {
        toast.success("Đã cập nhật giá mới!");
        setIsEditing(null);
        fetchPrices();
      }
    } catch (err) {
      toast.error("Lỗi cập nhật!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter">
            CẤU HÌNH <span className="text-red-600">GIÁ VÉ</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-2 flex items-center gap-2">
            <DollarSign size={12} className="text-red-600" /> Điều chỉnh biểu phí dịch vụ hệ thống
          </p>
        </div>
        <button className="bg-white text-black hover:bg-red-600 hover:text-white px-8 py-4 rounded-2xl font-black uppercase text-xs transition-all flex items-center gap-2">
          <Plus size={18} /> Thêm loại giá
        </button>
      </div>

      {/* Dashboard Mini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-2">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Giá trung bình</p>
          <p className="text-4xl font-[1000] italic">85.000đ</p>
        </div>
        <div className="bg-red-600/10 border border-red-600/20 p-8 rounded-[2.5rem] space-y-2">
          <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Loại vé bán chạy</p>
          <p className="text-4xl font-[1000] italic">VÉ VIP 2D</p>
        </div>
        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-2">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tỷ lệ VAT</p>
          <p className="text-4xl font-[1000] italic">10%</p>
        </div>
      </div>

      {/* Danh sách giá vé */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600" size={40} /></div>
        ) : prices.map((item: any) => (
          <div key={item.id} className="group bg-zinc-900/20 border border-white/5 hover:border-white/10 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 transition-all">
            {/* Icon loại vé */}
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors">
              <Ticket size={24} className="text-white" />
            </div>

            {/* Thông tin */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h3 className="text-xl font-[1000] italic uppercase">{item.name || 'Vé xem phim'}</h3>
                <span className="text-[9px] font-black bg-white/5 px-2 py-0.5 rounded text-zinc-500 uppercase tracking-tighter">
                  {item.category || 'Dịch vụ'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                Áp dụng cho: <span className="text-zinc-300">{item.description || 'Tất cả các rạp'}</span>
              </p>
            </div>

            {/* Giá tiền & Edit */}
            <div className="flex items-center gap-6">
              {isEditing === item.id ? (
                <div className="flex items-center gap-2 animate-in slide-in-from-right-4">
                  <input 
                    type="number" 
                    defaultValue={item.price}
                    className="w-32 bg-white/5 border border-red-600 rounded-xl py-2 px-4 outline-none font-black italic text-lg text-red-600"
                    onChange={(e) => setEditValue(Number(e.target.value))}
                    autoFocus
                  />
                  <button onClick={() => handleUpdatePrice(item.id)} className="p-2 bg-emerald-600 rounded-lg text-white"><Save size={18} /></button>
                  <button onClick={() => setIsEditing(null)} className="p-2 bg-zinc-800 rounded-lg text-zinc-400"><X size={18} /></button>
                </div>
              ) : (
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-600 uppercase italic">Đơn giá niêm yết</p>
                  <p className="text-3xl font-[1000] italic text-white tracking-tighter">
                    {item.price?.toLocaleString() || '0'}đ
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { setIsEditing(item.id); setEditValue(item.price); }}
                  className="p-3 bg-zinc-800 text-zinc-400 hover:bg-white hover:text-black rounded-xl transition-all"
                >
                  <Edit3 size={18} />
                </button>
                <button className="p-3 bg-zinc-800/50 text-zinc-600 hover:bg-red-600/20 hover:text-red-600 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && prices.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <p className="text-zinc-600 font-black uppercase text-xs tracking-widest italic opacity-50">Database trống - Chưa có cấu hình giá</p>
        </div>
      )}
    </div>
  );
}