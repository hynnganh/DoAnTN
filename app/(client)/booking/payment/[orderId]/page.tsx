"use client";
import React, { useEffect, useState, use } from 'react';
import { apiRequest } from '@/app/lib/api';
import { CheckCircle2, Home, Ticket } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await apiRequest(`/api/v1/orders/${orderId}`);
      if (res.ok) setOrder((await res.json()).data);
    };
    fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="space-y-6 max-w-sm">
        <CheckCircle2 size={80} className="text-green-500 mx-auto animate-bounce" />
        <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter">Đặt vé <span className="text-red-600">Thành công!</span></h1>
        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Mã đơn hàng: #{orderId}</p>
        
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-4">
           <div className="text-xs font-black uppercase text-zinc-500">Vui lòng kiểm tra email hoặc mục lịch sử để nhận mã vé QR.</div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6">
          <Link href="/" className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
            <Home size={20} /> <span className="text-[10px] font-black uppercase">Trang chủ</span>
          </Link>
          <Link href="/profile/tickets" className="flex flex-col items-center gap-2 p-4 bg-red-600 rounded-2xl hover:bg-red-700 transition-all">
            <Ticket size={20} /> <span className="text-[10px] font-black uppercase">Xem vé</span>
          </Link>
        </div>
      </div>
    </div>
  );
}