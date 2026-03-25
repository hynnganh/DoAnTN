"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Loader2, Plus, X, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Dùng để chuyển trang
import toast, { Toaster } from 'react-hot-toast';

export default function CinemaPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State cho Form thêm rạp
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    hoursPerRoom: 0,
    cinemaId: 1 // Mặc định hệ thống 1
  });

  // --- LẤY DANH SÁCH ---
  const fetchCinemas = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/cinema-items');
      const result = await res.json();
      setItems(result.data);
    } catch (err) {
      console.log("Lỗi kết nối BE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCinemas(); }, []);

  // --- HÀM THÊM RẠP (POST) ---
  const handleAddCinema = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/v1/cinema-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Thêm rạp thành công!");
        setIsModalOpen(false);
        fetchCinemas(); // Load lại danh sách
      }
    } catch (err) {
      toast.error("Lỗi khi thêm rạp!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-6xl font-[1000] italic uppercase tracking-tighter text-white">
          HỆ THỐNG <span className="text-red-600">CỤM RẠP</span>
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-black uppercase text-xs transition-all active:scale-95"
        >
          + Thêm chi nhánh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items?.map((item: any) => (
            <div 
              key={item.id} 
              onClick={() => router.push(`/super-admin/cinema/${item.id}`)} // NHẤN VÀO XEM CHI TIẾT
              className="group cursor-pointer bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 hover:border-red-600 hover:bg-zinc-800 transition-all shadow-xl"
            >
              <div className="flex justify-between mb-6">
                <span className="text-[10px] font-black text-red-600 uppercase border border-red-600/20 px-3 py-1 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all">
                  {item.cinema?.name || "VINACENTER"}
                </span>
              </div>

              <h2 className="text-2xl font-black uppercase italic text-white mb-2">{item.name}</h2>
              
              <div className="flex items-center gap-2 text-zinc-500 mb-6 text-xs font-bold">
                <MapPin size={14} className="text-red-600" /> 
                <span>{item.address}, {item.city}</span>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-between items-center text-zinc-400 font-bold">
                <div>
                  <p className="text-[10px] uppercase font-black">Công suất</p>
                  <p className="text-lg font-black italic text-white">{item.hoursPerRoom}h/Phòng</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black">Mã rạp</p>
                  <p className="text-sm font-black text-red-600">#00{item.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL THÊM RẠP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black italic uppercase">Thêm <span className="text-red-600">Rạp mới</span></h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-zinc-500 hover:text-white" /></button>
            </div>

            <form onSubmit={handleAddCinema} className="space-y-4">
              <input 
                placeholder="Tên cụm rạp..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-red-600"
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Thành phố..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-red-600"
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  required
                />
                <input 
                  type="number" 
                  placeholder="Giờ/Phòng..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-red-600"
                  onChange={e => setFormData({...formData, hoursPerRoom: parseInt(e.target.value)})}
                  required
                />
              </div>
              <textarea 
                placeholder="Địa chỉ chi tiết..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-red-600 h-24"
                onChange={e => setFormData({...formData, address: e.target.value})}
                required
              />
              <button type="submit" className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all">
                Xác nhận lưu rạp
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}