"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, CheckCircle2, XCircle, Loader2, Calendar, User } from 'lucide-react';
import { apiRequest } from '@/app/lib/api';

// 1. UPDATE INTERFACE THEO JSON MỚI
interface Order {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  orderDetails: Array<{
    id: number;
    itemType: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrderHistoryTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // HÀM CỨU HỘ JSON (Vá lỗi Infinite Recursion nếu BE chưa fix)
  const repairAndParse = (text: string) => {
    try {
      const validEnd = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
      if (validEnd === -1) return JSON.parse(text);
      let clean = text.substring(0, validEnd + 1);
      let oB = (clean.match(/\{/g) || []).length, cB = (clean.match(/\}/g) || []).length;
      let oA = (clean.match(/\[/g) || []).length, cA = (clean.match(/\]/g) || []).length;
      while (oA > cA++) clean += ']';
      while (oB > cB++) clean += '}';
      return JSON.parse(clean);
    } catch (e) { return null; }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/api/v1/orders');
        const rawText = await res.text();
        const result = repairAndParse(rawText);
        if (result && result.data) setOrders(result.data);
      } catch (err) { console.error("Lỗi:", err); } 
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => activeFilter === 'ALL' || o.status === activeFilter);

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Đang đồng bộ đơn hàng...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter">Lịch sử giao dịch</h2>
        
        {/* TAB FILTER */}
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
          {['ALL', 'PENDING', 'SUCCESS', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                activeFilter === tab ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab === 'ALL' ? 'Tất cả' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-white/5 rounded-[2.5rem] bg-zinc-900/10 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
          
          {filteredOrders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString('vi-VN');
            const userFullName = `${order.user?.firstName || ''} ${order.user?.lastName || 'Guest'}`;

            return (
              <div key={order.id} className="group flex items-center gap-5 p-5 bg-white/5 rounded-3xl border border-transparent hover:border-red-600/30 hover:bg-white/[0.07] transition-all duration-300">
                
                {/* ID ĐƠN HÀNG */}
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex flex-col items-center justify-center border border-white/5 shrink-0 shadow-inner">
                   <p className="text-[7px] text-zinc-600 font-[1000] uppercase italic">CODE</p>
                   <p className="text-xs text-white font-[1000] italic">#{order.id}</p>
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* THÔNG TIN NGƯỜI MUA & ITEM */}
                  <div className="md:col-span-5 truncate">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={10} className="text-zinc-700" />
                      <span className="text-[10px] text-zinc-500 font-bold uppercase truncate">{userFullName}</span>
                    </div>
                    <h4 className="font-black text-sm uppercase truncate tracking-tight text-zinc-200 group-hover:text-red-500 transition-colors">
                      {order.orderDetails?.[0]?.itemType || 'Booking'} x{order.orderDetails?.length || 0}
                    </h4>
                    <p className="text-[11px] font-[1000] text-red-600 italic mt-0.5">
                      {order.totalAmount.toLocaleString()} <span className="text-[8px] uppercase">VND</span>
                    </p>
                  </div>
                  
                  {/* THỜI GIAN */}
                  <div className="md:col-span-4 flex flex-col gap-1 text-zinc-500 text-[10px] font-[1000] uppercase italic">
                    <div className="flex items-center gap-2"><Clock size={12} className="text-zinc-800"/> {new Date(order.createdAt).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</div>
                    <div className="flex items-center gap-2"><Calendar size={12} className="text-zinc-800"/> {date}</div>
                  </div>

                  {/* TRẠNG THÁI */}
                  <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-5">
                    <span className="hidden md:block text-[8px] font-black text-zinc-700 uppercase tracking-widest px-3 py-1 rounded-full border border-white/5">
                      {order.paymentMethod}
                    </span>
                    
                    <div className={
                      order.status === 'SUCCESS' ? 'text-green-500' : 
                      order.status === 'CANCELLED' ? 'text-zinc-800' : 'text-amber-600 animate-pulse'
                    }>
                      {order.status === 'SUCCESS' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    </div>
                  </div>
                </div>

                <button className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="py-32 text-center opacity-20">
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em]">No transactions found</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
      `}</style>
    </div>
  );
}