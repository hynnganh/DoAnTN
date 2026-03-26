"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, Monitor, Trash2, Edit3, 
  Loader2, RefreshCw, Layers, Maximize, 
  CheckCircle2, XCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function QuanLyPhongChieuPage() {
  const [phongChieu, setPhongChieu] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // State cho Form (Thêm/Sửa)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    roomName: '',
    screenType: 'Standard',
    totalSeats: 0
  });

  const layDanhSachPhong = async () => {
    try {
      setDangTai(true);
      const res = await fetch('http://localhost:8080/api/v1/rooms', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) setPhongChieu(data.data || []);
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ!");
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => { layDanhSachPhong(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:8080/api/v1/rooms/${editingId}` 
      : 'http://localhost:8080/api/v1/rooms';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingId ? "Cập nhật thành công!" : "Thêm phòng mới thành công!");
        setShowModal(false);
        setEditingId(null);
        setFormData({ roomName: '', screenType: 'Standard', totalSeats: 0 });
        layDanhSachPhong();
      }
    } catch (err) {
      toast.error("Đã có lỗi xảy ra!");
    }
  };

  const xoaPhong = async (id: number) => {
    if (!window.confirm("Xác nhận xóa phòng chiếu này?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/v1/rooms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success("Đã xóa phòng!");
        layDanhSachPhong();
      }
    } catch (err) {
      toast.error("Không thể xóa phòng đang có suất chiếu!");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 font-sans selection:bg-red-600/30">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-zinc-900 rounded-3xl border border-white/5 shadow-2xl">
            <Monitor className="text-red-600 animate-pulse" size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter leading-none">
              HỆ THỐNG <span className="text-red-600">PHÒNG CHIẾU</span>
            </h1>
            <p className="text-zinc-500 font-black uppercase text-[9px] tracking-[0.4em] mt-2 italic">Cấu hình rạp phim A&K</p>
          </div>
        </div>

        <button 
          onClick={() => { setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          Thiết lập phòng mới
        </button>
      </div>

      {/* GRID DANH SÁCH PHÒNG */}
      {dangTai ? (
        <div className="flex flex-col items-center justify-center p-32">
          <Loader2 className="animate-spin text-red-600" size={48} />
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Đang đồng bộ dữ liệu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {phongChieu.map((room) => (
            <div key={room.roomId} className="group relative bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 hover:border-red-600/50 transition-all backdrop-blur-md">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-black rounded-2xl border border-white/5 group-hover:text-red-500 transition-colors">
                  <Layers size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => {
                      setEditingId(room.roomId);
                      setFormData({ roomName: room.roomName, screenType: room.screenType, totalSeats: room.totalSeats });
                      setShowModal(true);
                    }}
                    className="p-2 hover:bg-white hover:text-black rounded-xl transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => xoaPhong(room.roomId)}
                    className="p-2 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-[1000] italic uppercase mb-2 group-hover:text-red-500 transition-colors">
                {room.roomName}
              </h3>
              
              <div className="flex items-center gap-4 mt-6">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Loại màn hình</span>
                  <span className="text-xs font-bold text-zinc-200 italic">{room.screenType || 'Standard'}</span>
                </div>
                <div className="w-px h-8 bg-white/5" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Sức chứa</span>
                  <span className="text-xs font-bold text-zinc-200">{room.totalSeats} Ghế</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL THÊM/SỬA PHÒNG */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0c0c0e] border border-white/10 rounded-[3rem] p-10 w-full max-w-md shadow-2xl">
            <h2 className="text-3xl font-[1000] italic uppercase text-white mb-8">
              {editingId ? 'Cập nhật' : 'Thiết lập'} <span className="text-red-600">Phòng</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Tên phòng chiếu</label>
                <input 
                  required
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-red-600/50"
                  value={formData.roomName}
                  onChange={(e) => setFormData({...formData, roomName: e.target.value})}
                  placeholder="VD: Phòng 01 (IMAX)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Loại màn hình</label>
                  <select 
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:border-red-600/50 appearance-none"
                    value={formData.screenType}
                    onChange={(e) => setFormData({...formData, screenType: e.target.value})}
                  >
                    <option value="Standard">Standard</option>
                    <option value="IMAX">IMAX</option>
                    <option value="4DX">4DX</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Tổng số ghế</label>
                  <input 
                    type="number"
                    required
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-red-600/50"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({...formData, totalSeats: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase hover:bg-white/5 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-red-600 text-[10px] font-black uppercase hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                >
                  Xác nhận lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}