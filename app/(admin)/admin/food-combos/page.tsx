"use client";
import React, { useState, useEffect } from 'react';
// XÓA StatCard khỏi đây nhé bà
import { 
  Search, Plus, Box, Zap, Edit2, Trash2, 
  Loader2, ImageIcon, Package, AlertTriangle 
} from 'lucide-react';

export default function FoodManagement() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch dữ liệu từ Spring Boot
  const fetchCombos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/v1/combos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      setCombos(result.data || result); 
    } catch (error) {
      console.error("Lỗi fetch combo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const filteredItems = combos.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 no-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter text-white">
            QUẢN LÝ <span className="text-red-600">COMBO & ĐỒ ĂN</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">
            A&K Cinema Core System / F&B Division
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-600/20">
          <Plus size={16} /> Tạo Combo Mới
        </button>
      </div>

      {/* Stats - Dùng component tự định nghĩa ở dưới */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Tổng Combo" value={combos.length.toString()} icon={<Box size={20}/>} color="text-blue-500" />
        <StatCard title="Trạng thái" value="Ổn định" icon={<Zap size={20}/>} color="text-amber-500" />
        <StatCard title="Giá cao nhất" value={combos.length > 0 ? `${Math.max(...combos.map(o => o.price || 0)).toLocaleString()}đ` : "0đ"} icon={<Package size={20}/>} color="text-red-500" />
      </div>

      {/* Table Section */}
      <div className="bg-zinc-900/30 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên Combo..." 
              className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-xs outline-none focus:border-red-600/30 transition-all text-white font-bold"
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-red-600" size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Đang truy vấn Database...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-white/5">
                  <th className="px-8 py-5">Sản phẩm</th>
                  <th className="px-6 py-5">Mô tả</th>
                  <th className="px-6 py-5">Giá bán</th>
                  <th className="px-6 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/5 overflow-hidden flex items-center justify-center shadow-inner">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <ImageIcon size={20} className="text-zinc-700" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white leading-none mb-1 uppercase italic tracking-tight">{item.name}</p>
                          <p className="text-[9px] text-red-600 font-bold uppercase tracking-widest">ID: {item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-[300px]">
                      <p className="text-[11px] text-zinc-500 italic line-clamp-2 leading-relaxed">
                        {item.description || "Chưa có thông tin mô tả chi tiết."}
                      </p>
                    </td>
                    <td className="px-6 py-5 font-black italic text-white text-lg tracking-tighter">
                      {item.price?.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-2.5 bg-red-600/5 hover:bg-red-600/20 rounded-xl text-zinc-500 hover:text-red-600 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// --- ĐỊNH NGHĨA COMPONENT CON (Để trong cùng 1 file) ---

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-[32px] relative overflow-hidden group hover:border-white/10 transition-all">
      <div className={`p-3 rounded-2xl bg-black/40 w-fit mb-4 ${color} group-hover:scale-110 transition-transform relative z-10`}>
        {icon}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{title}</p>
        <h3 className="text-3xl font-[1000] text-white italic tracking-tighter">{value}</h3>
      </div>
      {/* Icon to ẩn dưới nền */}
      <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 group-hover:-translate-y-2">
        {React.isValidElement(icon) && 
          React.cloneElement(icon as React.ReactElement<any>, { 
            size: 100,
            strokeWidth: 1
          })
        }
      </div>
    </div>
  );
}