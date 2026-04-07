"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, Search, ChevronRight, Calendar, 
  Hash, CreditCard, Ticket, Clock, Loader2, RefreshCcw
} from 'lucide-react';
import { apiRequest } from '@/app/lib/api'; // Giả sử bạn để hàm trên vào file này

export default function SuperAdminHCMPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Sử dụng hàm apiRequest của bạn
      const response = await apiRequest('/api/v1/orders', {
        method: 'GET'
      });

      if (response.ok) {
        const result = await response.json();
        // Cấu trúc: { status: 0, message: "...", data: [...] }
        setOrders(result.data || []);
      } else {
        console.error("Lỗi Protocol:", response.status);
        // Nếu 403 -> Có thể token hết hạn hoặc sai Role
        // Nếu 404 -> Link API sai hoặc Backend chưa chạy
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Lọc dữ liệu sau khi đã fetch thành công
  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchTerm) ||
    order.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans tracking-tight">
      
      {/* HEADER & REFRESH */}
      <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-2xl">
            <MapPin className="text-red-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter">
              Khu vực <span className="text-red-600">Hồ Chí Minh</span>
            </h1>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-1">
              Hệ thống truy xuất dữ liệu thực tế
            </p>
          </div>
        </div>

        <button 
          onClick={fetchOrders}
          className="p-4 bg-zinc-900 border border-white/5 rounded-2xl hover:text-red-500 transition-all active:scale-95"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* SEARCH TOOLBAR */}
      <div className="relative mb-8 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-red-600 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="TÌM KIẾM MÃ ĐƠN, TRẠNG THÁI..."
          className="w-full bg-zinc-900/30 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-[11px] font-bold outline-none focus:border-red-600/50"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* DATA TABLE */}
      <div className="bg-zinc-950/40 border border-white/5 rounded-[2.5rem] overflow-hidden relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-red-600" size={40} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-6 text-[9px] font-black uppercase text-zinc-700 italic">Giao dịch</th>
                <th className="p-6 text-[9px] font-black uppercase text-zinc-700 italic">Items</th>
                <th className="p-6 text-[9px] font-black uppercase text-zinc-700 italic">Phương thức</th>
                <th className="p-6 text-[9px] font-black uppercase text-zinc-700 italic text-right">Tổng tiền</th>
                <th className="p-6 text-[9px] font-black uppercase text-zinc-700 italic text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.01] group transition-all">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center text-zinc-800 group-hover:text-red-600">
                        <Hash size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black italic tracking-tight">#{order.id}</p>
                        <p className="text-[8px] font-bold text-zinc-600 uppercase mt-1">
                           {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1.5">
                      {order.orderDetails?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <Ticket size={12} className="text-red-700" />
                          <span className="text-[10px] font-black uppercase italic text-zinc-400">
                             {item.itemType} <span className="text-zinc-600 ml-1">x{item.quantity}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-zinc-700" />
                      <span className="text-[10px] font-black uppercase text-zinc-500 italic">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <p className="text-base font-[1000] italic text-zinc-100">
                      {order.totalAmount?.toLocaleString()}đ
                    </p>
                    <span className={`text-[8px] font-black uppercase italic ${order.status === 'SUCCESS' ? 'text-emerald-500' : 'text-zinc-700'}`}>
                      • {order.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="w-10 h-10 inline-flex items-center justify-center bg-zinc-900 hover:bg-white hover:text-black rounded-xl transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              )) : !loading && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-[10px] font-black uppercase text-zinc-800 tracking-[0.5em] italic">
                    Node: No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}