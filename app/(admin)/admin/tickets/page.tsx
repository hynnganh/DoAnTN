"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, CheckCircle2, XCircle, Loader2, Calendar, User, Building2 } from 'lucide-react';
import { apiRequest } from '@/app/lib/api';

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
  };
  orderDetails: any[];
}

export default function OrderHistoryTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [myCinemaId, setMyCinemaId] = useState<number | null>(null);

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
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy ID rạp quản lý
        const userRes = await apiRequest('/api/v1/users/me');
        const userData = await userRes.json();
        const cinemaId = userData.data?.managedCinemaItemId;
        setMyCinemaId(cinemaId);

        // Lấy danh sách đơn hàng
        const res = await apiRequest('/api/v1/orders');
        const rawText = await res.text();
        const result = repairAndParse(rawText);
        if (result && result.data) setOrders(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // LOGIC LỌC CHÍNH
  const filteredOrders = orders.filter(order => {
    const matchStatus = activeFilter === 'ALL' || order.status === activeFilter;
    
    // Kiểm tra cinemaId trong từng order detail
    const matchCinema = order.orderDetails?.some((detail: any) => {
      // Tìm cinemaId (path này phụ thuộc vào cách bạn trả về JSON ở OrderDetail)
      const cId = detail.ticket?.showtime?.room?.cinemaItem?.id || 
                  detail.showtime?.cinemaItem?.id;
      return Number(cId) === Number(myCinemaId);
    });

    return matchStatus && matchCinema;
  });

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center bg-[#050505]">
      <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Đang lọc dữ liệu rạp...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter text-white">
             Giao dịch <span className="text-red-600">tại rạp</span>
           </h2>
           <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
             <Building2 size={12}/> ID Quản lý: {myCinemaId || 'Đang tải...'}
           </p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md overflow-x-auto no-scrollbar">
          {['ALL', 'PENDING', 'SUCCESS', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === tab ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab === 'ALL' ? 'Tất cả' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-white/5 rounded-[2.5rem] bg-zinc-900/10 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto p-4 space-y-3 no-scrollbar">
          {filteredOrders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString('vi-VN');
            const userFullName = `${order.user?.firstName || ''} ${order.user?.lastName || 'Khách'}`;

            return (
              <div key={order.id} className="group flex items-center gap-5 p-5 bg-white/5 rounded-3xl border border-transparent hover:border-red-600/30 hover:bg-white/[0.07] transition-all duration-300">
                
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex flex-col items-center justify-center border border-white/5 shrink-0">
                   <p className="text-[7px] text-zinc-600 font-black uppercase italic">BILL</p>
                   <p className="text-xs text-white font-[1000] italic">#{order.id}</p>
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-5">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={10} className="text-zinc-700" />
                      <span className="text-[10px] text-zinc-500 font-bold uppercase truncate">{userFullName}</span>
                    </div>
                    <h4 className="font-black text-sm uppercase truncate text-zinc-200 group-hover:text-red-500 transition-colors">
                      {order.orderDetails?.[0]?.itemType || 'Ticket'} x{order.orderDetails?.length || 0}
                    </h4>
                    <p className="text-[11px] font-[1000] text-red-600 italic mt-0.5 tracking-tight">
                      {order.totalAmount.toLocaleString()} VND
                    </p>
                  </div>
                  
                  <div className="md:col-span-4 flex flex-col gap-1 text-zinc-500 text-[10px] font-black uppercase italic opacity-60">
                    <div className="flex items-center gap-2"><Clock size={12}/> {new Date(order.createdAt).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</div>
                    <div className="flex items-center gap-2"><Calendar size={12}/> {date}</div>
                  </div>

                  <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-5">
                    <span className="hidden md:block text-[8px] font-black text-zinc-700 uppercase tracking-widest px-3 py-1 rounded-full border border-white/5">
                      {order.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'}
                    </span>
                    <div className={
                      order.status === 'SUCCESS' ? 'text-green-500' : 
                      order.status === 'CANCELLED' ? 'text-zinc-800' : 'text-amber-600 animate-pulse'
                    }>
                      {order.status === 'SUCCESS' ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
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
            <div className="py-32 text-center">
              <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.5em] italic">Không có dữ liệu cho rạp này</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}