"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiRequest } from '@/app/lib/api';
import { ChevronLeft, Heart } from 'lucide-react'; // Thêm icon Heart

export default function SeatDesignerPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id;

  const [danhSachGhe, setDanhSachGhe] = useState<any[]>([]);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [dangTai, setDangTai] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);
  
  const [config, setConfig] = useState({ rows: 10, cols: 12 });
  const [manualSeat, setManualSeat] = useState({ row: 'A', num: '1' });

  const whiteToast = {
    style: { background: '#ffffff', color: '#000000', fontSize: '12px', fontWeight: '900', borderRadius: '12px', padding: '16px' }
  };

  const taiDuLieu = useCallback(async () => {
    if (!roomId) return;
    try {
      setDangTai(true);
      const [resSeats, resRoom] = await Promise.all([
        apiRequest(`/api/v1/seats/room/${roomId}`),
        apiRequest(`/api/v1/rooms/${roomId}`)
      ]);

      if (resSeats.ok) {
        const dataSeats = await resSeats.json();
        setDanhSachGhe(dataSeats.data || []);
      }
      if (resRoom.ok) {
        const dataRoom = await resRoom.json();
        setRoomInfo(dataRoom.data);
      }
    } catch (err) {
      toast.error("Lỗi tải dữ liệu!", whiteToast);
    } finally {
      setDangTai(false);
    }
  }, [roomId]);

  useEffect(() => { taiDuLieu(); }, [taiDuLieu]);

  const handleGenerate = async () => {
    const totalToGenerate = config.rows * config.cols;
    const maxCapacity = roomInfo?.capacity || 999;

    if (totalToGenerate > maxCapacity) {
      return toast.error(`Vượt quá sức chứa phòng (${maxCapacity} ghế)!`, whiteToast);
    }

    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-black text-[10px] uppercase tracking-tighter">Xóa sạch sơ đồ cũ và tạo mới {totalToGenerate} ghế?</p>
        <div className="flex gap-2">
          <button onClick={async () => { toast.dismiss(t.id); thucHienResetVaTaoMoi(); }} className="bg-red-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase">Xác nhận</button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-zinc-100 px-4 py-2 rounded-lg text-[10px] font-black text-black uppercase">Hủy</button>
        </div>
      </div>
    ), { ...whiteToast, duration: 6000 });
  };

  const thucHienResetVaTaoMoi = async () => {
    const loading = toast.loading("Đang dọn dẹp...", whiteToast);
    try {
      if (danhSachGhe.length > 0) {
        const deletePromises = danhSachGhe
          .filter(ghe => !String(ghe.id).startsWith('temp-'))
          .map(ghe => apiRequest(`/api/v1/seats/${ghe.id}`, { method: 'DELETE' }));
        await Promise.all(deletePromises);
      }
      const query = `?roomId=${roomId}&rows=${config.rows}&seatsPerRow=${config.cols}`;
      const res = await apiRequest(`/api/v1/seats/generate${query}`, { method: 'POST' });

      if (res.ok) {
        toast.success("Đã làm mới sơ đồ!", { id: loading, ...whiteToast });
        taiDuLieu(); 
      }
    } catch (err) {
      toast.error("Lỗi hệ thống!", { id: loading, ...whiteToast });
    }
  };

  const handleAddSingleSeat = () => {
    const row = manualSeat.row.trim().toUpperCase();
    const num = parseInt(manualSeat.num);
    const maxCapacity = roomInfo?.capacity || 999;

    if (danhSachGhe.length >= maxCapacity) return toast.error("Phòng đầy!", whiteToast);
    if (!row || isNaN(num)) return toast.error("Nhập đủ thông tin!", whiteToast);

    if (danhSachGhe.some(g => g.seatRow === row && Number(g.seatNumber) === num)) {
      return toast.error(`Ghế ${row}${num} đã có!`, whiteToast);
    }

    const newSeat = { 
      id: `temp-${Date.now()}`, 
      seatRow: row, 
      seatNumber: num, 
      seatType: 'NORMAL', 
      price: 60000, 
      roomId: Number(roomId), 
      isNew: true 
    };

    setDanhSachGhe([...danhSachGhe, newSeat]);
    setManualSeat(prev => ({ ...prev, num: (num + 1).toString() }));
  };

  const handleSaveAll = async () => {
    setDangLuu(true);
    const loading = toast.loading("Đang lưu...", whiteToast);
    try {
      const promises = danhSachGhe.map(ghe => {
        const isNew = String(ghe.id).startsWith('temp-');
        const body = { seatRow: ghe.seatRow, seatNumber: ghe.seatNumber, seatType: ghe.seatType, price: ghe.price, roomId: Number(roomId) };
        return apiRequest(isNew ? `/api/v1/seats` : `/api/v1/seats/${ghe.id}`, { method: isNew ? 'POST' : 'PUT', body: JSON.stringify(body) });
      });
      await Promise.all(promises);
      toast.success("Đã lưu sơ đồ!", { id: loading, ...whiteToast });
      taiDuLieu();
    } catch (err) {
      toast.error("Lưu thất bại!", { id: loading, ...whiteToast });
    } finally {
      setDangLuu(false);
    }
  };

  const toggleSeatType = (ghe: any) => {
    const types = ['NORMAL', 'VIP', 'SWEETBOX'];
    const prices = { 'NORMAL': 60000, 'VIP': 90000, 'SWEETBOX': 150000 };
    const nextType = types[(types.indexOf(ghe.seatType) + 1) % types.length];
    setDanhSachGhe(danhSachGhe.map(s => s.id === ghe.id ? { ...s, seatType: nextType, price: prices[nextType as keyof typeof prices] } : s));
  };

  const groupedSeats = danhSachGhe.reduce((acc: any, ghe: any) => {
    const row = ghe.seatRow;
    if (!acc[row]) acc[row] = [];
    acc[row].push(ghe);
    return acc;
  }, {});
  
  const sortedRows = Object.keys(groupedSeats).sort();
  const maxCol = Math.max(config.cols, ...danhSachGhe.map(g => Number(g.seatNumber) || 0));

  if (dangTai) return <div className="h-screen bg-black flex items-center justify-center font-black text-red-600 animate-pulse uppercase tracking-[0.5em]">Loading Designer...</div>;

  return (
    <div className="h-screen bg-[#050505] text-zinc-400 flex flex-col font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="flex-none h-[70px] px-4 border-b border-white/5 flex justify-between items-center bg-[#050505] z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-zinc-900/50 border border-white/5 rounded-xl hover:bg-white hover:text-black transition-all group">
            <ChevronLeft size={18} strokeWidth={3} />
          </button>
          <div>
            <h1 className="text-lg font-[1000] uppercase italic text-white tracking-tighter leading-none">SƠ ĐỒ: {roomInfo?.roomName}</h1>
            <p className="text-zinc-600 text-[10px] mt-1 font-bold uppercase tracking-widest">Sức chứa: {danhSachGhe.length} / {roomInfo?.capacity}</p>
          </div>
        </div>
        <button onClick={handleSaveAll} disabled={dangLuu} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-[1000] text-[10px] uppercase tracking-widest transition-all">
          {dangLuu ? "..." : "LƯU THAY ĐỔI"}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-[280px] flex-shrink-0 bg-[#0a0a0a] border-r border-white/5 p-5 flex flex-col gap-5 overflow-y-auto">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">■ GEN SƠ ĐỒ</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <input type="number" value={config.rows} onChange={(e) => setConfig({...config, rows: +e.target.value})} className="bg-[#1a1a1a] border border-white/5 rounded-lg py-2 text-white text-center outline-none" />
              <input type="number" value={config.cols} onChange={(e) => setConfig({...config, cols: +e.target.value})} className="bg-[#1a1a1a] border border-white/5 rounded-lg py-2 text-white text-center outline-none" />
            </div>
            <button onClick={handleGenerate} className="w-full py-2.5 bg-white text-black hover:bg-red-600 hover:text-white rounded-lg font-black text-[9px] uppercase transition-all">RESET & TẠO MỚI</button>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-2xl p-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">+ THÊM GHẾ LẺ</h3>
            <div className="flex gap-2 mb-4">
              <input type="text" value={manualSeat.row} onChange={(e) => setManualSeat({...manualSeat, row: e.target.value})} className="w-1/2 bg-[#1a1a1a] border border-white/5 rounded-lg py-2 text-center text-white font-bold" />
              <input type="number" value={manualSeat.num} onChange={(e) => setManualSeat({...manualSeat, num: e.target.value})} className="w-1/2 bg-[#1a1a1a] border border-white/5 rounded-lg py-2 text-center text-white font-bold" />
            </div>
            <button onClick={handleAddSingleSeat} className="w-full py-2.5 bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg font-black text-[9px] uppercase">CHÈN GHẾ</button>
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <main className="flex-1 bg-[#050505] overflow-auto relative p-10 flex flex-col items-center">
          <div className="w-full max-w-2xl flex flex-col items-center mb-16">
            <div className="w-full h-[2px] bg-zinc-800 rounded-full"></div>
            <span className="text-[8px] font-black tracking-[1em] text-zinc-700 uppercase mt-3">Screen Area</span>
          </div>

          {/* GRID GHẾ */}
<div className="flex flex-col items-center gap-1.5 pb-24 min-w-max">
  {sortedRows.map((rowLetter) => (
    <div key={rowLetter} className="flex items-center gap-6">
      {/* Nhãn hàng bên trái */}
      <div className="w-6 text-center font-black text-zinc-800 text-[11px] uppercase select-none">
        {rowLetter}
      </div>
      
      <div className="flex items-center gap-1.5">
        {Array.from({ length: maxCol }).map((_, index) => {
          const seatNum = index + 1;
          const ghe = groupedSeats[rowLetter].find((g: any) => Number(g.seatNumber) === seatNum);
          
          // Nếu ô trống, vẫn giữ w-10 để đảm bảo hàng cột thẳng hàng
          if (!ghe) return <div key={`empty-${rowLetter}-${seatNum}`} className="w-10 h-10 flex-shrink-0" />;

          const isSweet = ghe.seatType === 'SWEETBOX';

          return (
            <div 
              key={ghe.id} 
              onClick={() => toggleSeatType(ghe)}
              className={`
                h-10 flex-shrink-0 rounded-xl flex flex-col items-center justify-center border relative group cursor-pointer transition-all duration-300 hover:scale-105 z-10
                ${isSweet 
                  ? 'w-[86px] bg-pink-600/10 border-pink-500/40 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.1)]' 
                  : ghe.seatType === 'VIP'
                    ? 'w-10 bg-amber-600/10 border-amber-500/40 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                    : 'w-10 bg-zinc-900/50 border-white/5 text-zinc-400 hover:border-zinc-500'
                }
              `}
            >
              {isSweet && <Heart size={10} className="mb-0.5 animate-pulse" />}
              <span className="text-[10px] font-black tracking-tighter uppercase select-none">
                {ghe.seatRow}{ghe.seatNumber}
              </span>
              
              {/* Nút xóa ghế nhanh */}
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setDanhSachGhe(danhSachGhe.filter(s => s.id !== ghe.id)); 
                }} 
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-white/10 text-[10px] shadow-xl z-20"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Nhãn hàng bên phải */}
      <div className="w-6 text-center font-black text-zinc-800 text-[11px] uppercase select-none">
        {rowLetter}
      </div>
    </div>
  ))}
</div>
        </main>
      </div>
    </div>
  );
}