"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ChevronRight, 
  CreditCard,
  Calendar
} from 'lucide-react';
import { apiRequest } from '@/app/lib/api'; 
import Cookies from 'js-cookie';

// --- INTERFACES ---
interface OrderDetail {
  id: number;
  itemType: string;
  itemId: number;
  quantity: number;
  price: number;
  createdAt: string;
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  orderDetails: OrderDetail[];
}

export default function PaymentTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token") || Cookies.get("token");
      if (!token) { setLoading(false); return; }
      
      try {
        const res = await apiRequest('/api/v1/orders/my-history');
        if (res.ok) {
          const result = await res.json();
          // Sắp xếp đơn hàng mới nhất lên đầu
          const sortedData = (result.data || []).sort((a: Order, b: Order) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sortedData);
        }
      } catch (err) {
        console.error("Lỗi lấy lịch sử đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-[1000] uppercase tracking-tighter italic text-white">Lịch sử giao dịch</h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Quản lý hóa đơn và thanh toán</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
          <span className="text-[10px] font-black text-red-600 uppercase">Tổng đơn: {orders.length}</span>
        </div>
      </div>

      {/* Danh sách đơn hàng */}
      <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {orders.length > 0 ? orders.map((order) => (
          <div 
            key={order.id} 
            className="group bg-[#0c0c0c] border border-white/5 rounded-[2rem] p-6 hover:border-red-600/30 transition-all duration-500 hover:bg-white/[0.02]"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Cột 1: Mã đơn & Thời gian */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-600/10 rounded-lg">
                    <ShoppingBag size={16} className="text-red-600" />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-wider">Mã đơn: #ORD-{order.id}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold">
                  <Calendar size={12} />
                  {formatDate(order.createdAt)}
                </div>
              </div>

              {/* Cột 2: Chi tiết Item (Rút gọn) */}
              <div className="flex-1 border-l border-white/5 md:pl-6">
                <p className="text-[9px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Sản phẩm</p>
                <div className="flex flex-wrap gap-2">
                  {order.orderDetails.map((item) => (
                    <div key={item.id} className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <span className="text-[10px] font-bold text-zinc-300">
                        {item.itemType === 'TICKET' ? 'Vé xem phim' : 'Bắp nước'} x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cột 3: Thanh toán & Trạng thái */}
              <div className="flex items-center justify-between md:justify-end gap-8 md:min-w-[200px]">
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Tổng tiền</p>
                  <p className="text-lg font-black text-red-500 italic tracking-tighter">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                    order.status === 'COMPLETED' || order.status === 'SUCCESS' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                  }`}>
                    {order.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    <span className="text-[9px] font-black uppercase tracking-widest">{order.status}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 uppercase">
                    <CreditCard size={10} /> {order.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Nút xem chi tiết */}
              <button className="hidden md:flex w-10 h-10 rounded-full bg-white/5 items-center justify-center text-white hover:bg-red-600 transition-all group-hover:translate-x-1">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )) : (
          <div className="py-24 text-center border border-dashed border-white/5 rounded-[3rem]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={24} className="text-zinc-700" />
            </div>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Chưa có đơn hàng nào</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
      `}</style>
    </div>
  );
}