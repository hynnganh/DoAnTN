"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Minus, ShoppingBasket, Loader2 } from 'lucide-react';
import { apiRequest, getImageUrl } from "@/app/lib/api"; 
import toast, { Toaster } from 'react-hot-toast';

export default function ComboPage({ params }: { params: Promise<{ showtimeId: string }> }) {
  const { showtimeId } = use(params);
  const router = useRouter();
  const [combos, setCombos] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState<any[]>([]);
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem('booking_data');
    if (!saved) return router.push(`/booking/${showtimeId}`);
    setBookingData(JSON.parse(saved));
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    const res = await apiRequest('/api/v1/combos');
    if (res.ok) setCombos((await res.json()).data);
    setLoading(false);
  };

  const handleNext = () => {
    sessionStorage.setItem('booking_data', JSON.stringify({
      ...bookingData,
      selectedCombos,
      comboPrice: selectedCombos.reduce((sum, c) => sum + (c.price * c.quantity), 0)
    }));
    router.push(`/booking/payment`);
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-8">
        <button onClick={() => router.back()} className="text-zinc-500 uppercase text-[10px] font-black italic flex items-center gap-2"><ChevronLeft size={16}/> Trở lại</button>
        <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter">Thêm <span className="text-red-600">Bắp & Nước</span></h1>
        <div className="grid grid-cols-1 gap-4">
          {combos.map((c: any) => {
            const qty = selectedCombos.find(i => i.id === c.id)?.quantity || 0;
            return (
              <div key={c.id} className="p-6 bg-zinc-900/30 border border-white/5 rounded-[2rem] flex items-center gap-6">
                <img src={getImageUrl(c.imageUrl)} className="w-24 h-24 rounded-2xl object-cover" alt="" />
                <div className="flex-1">
                  <h3 className="font-black italic uppercase text-lg">{c.name}</h3>
                  <p className="text-zinc-500 text-xs">{c.description}</p>
                  <p className="text-red-600 font-black">{c.price.toLocaleString()}đ</p>
                </div>
                <div className="flex items-center gap-4 bg-black p-2 rounded-xl border border-white/5">
                  <button onClick={() => setSelectedCombos(prev => qty > 1 ? prev.map(i => i.id === c.id ? {...i, quantity: i.quantity - 1} : i) : prev.filter(i => i.id !== c.id))} className="p-2 text-zinc-500"><Minus size={14}/></button>
                  <span className="font-black text-xl w-6 text-center">{qty}</span>
                  <button onClick={() => setSelectedCombos(prev => qty > 0 ? prev.map(i => i.id === c.id ? {...i, quantity: i.quantity + 1} : i) : [...prev, {...c, quantity: 1}])} className="p-2 bg-white text-black rounded-lg"><Plus size={14}/></button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-8 bg-zinc-950 border border-white/10 rounded-[2.5rem] flex justify-between items-center sticky bottom-6 shadow-2xl">
           <div><p className="text-[10px] text-zinc-500 font-black uppercase">Tổng thanh toán</p><div className="text-3xl font-[1000] italic text-white uppercase tracking-tighter">{(bookingData.seatPrice + selectedCombos.reduce((sum, c) => sum + (c.price * c.quantity), 0)).toLocaleString()}đ</div></div>
           <button onClick={handleNext} className="px-12 py-5 bg-red-600 rounded-2xl font-[1000] italic uppercase tracking-widest">Thanh toán <ShoppingBasket className="inline ml-2"/></button>
        </div>
      </div>
    </div>
  );
}