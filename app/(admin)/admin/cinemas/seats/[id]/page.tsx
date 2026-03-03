"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Armchair, Gem, Heart, Ban, Info, MousePointer2, Trash2, Maximize, Eraser, Sparkles, Wand2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// --- CẤU HÌNH LOẠI GHẾ ---
interface SeatConfig {
  label: string;
  color: string;
  glow: string;
  icon: React.ReactNode;
  price: string;
}

const SEAT_TYPES: Record<string, SeatConfig> = {
  NORMAL: { label: 'Ghế Thường', color: 'bg-zinc-600', glow: 'shadow-[0_0_15px_rgba(82,82,91,0.4)]', icon: <Armchair size={14} />, price: 'Gốc' },
  VIP: { label: 'Ghế VIP', color: 'bg-amber-500', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]', icon: <Gem size={14} />, price: '+20%' },
  COUPLE: { label: 'Ghế Đôi', color: 'bg-rose-500', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]', icon: <Heart size={14} />, price: '+50%' },
  BROKEN: { label: 'Đang Hỏng', color: 'bg-zinc-900 border border-red-500/40 text-red-500', glow: 'shadow-none', icon: <Ban size={14} />, price: 'Khóa' },
};

export default function SeatEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const cols = Array.from({ length: 14 }, (_, i) => i + 1);

  const [selectedType, setSelectedType] = useState<string>('NORMAL');
  const [seats, setSeats] = useState<Record<string, string>>({});
  const [isErasing, setIsErasing] = useState(false);
  
  const isPainting = useRef(false);

  // Xử lý vẽ/xóa trên Grid
  const handleAction = useCallback((seatId: string) => {
    const targetType = isErasing ? 'EMPTY' : selectedType;
    setSeats(prev => {
      if (prev[seatId] === targetType) return prev;
      return { ...prev, [seatId]: targetType };
    });
  }, [selectedType, isErasing]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    isPainting.current = true;
    const target = e.target as HTMLElement;
    const seatNode = target.closest('[data-seat-id]') as HTMLElement;
    if (seatNode) handleAction(seatNode.getAttribute('data-seat-id')!);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPainting.current) return;
    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
    const seatNode = target?.closest('[data-seat-id]') as HTMLElement;
    if (seatNode) handleAction(seatNode.getAttribute('data-seat-id')!);
  };

  useEffect(() => {
    const stop = () => { isPainting.current = false; };
    window.addEventListener('pointerup', stop);
    return () => window.removeEventListener('pointerup', stop);
  }, []);

  return (
    <div className="max-w-[1500px] mx-auto space-y-6 pb-12 select-none touch-none p-4 animate-in fade-in zoom-in-95 duration-700">
      <Toaster position="top-right" />

      {/* --- THANH ĐIỀU HƯỚNG (BO TRÒN MỀM) --- */}
      <div className="flex justify-between items-center bg-zinc-900/70 backdrop-blur-2xl p-4 md:p-5 rounded-[2.5rem] border border-white/5 sticky top-4 z-50 shadow-2xl">
        <button onClick={() => router.back()} className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-all px-4 py-2 rounded-full hover:bg-white/5">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Trở về</span>
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Wand2 size={16} className="text-red-500 animate-pulse" />
            <h1 className="text-lg font-black uppercase tracking-tighter text-white italic">Thiết Kế Sơ Đồ</h1>
          </div>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Phòng Chiếu 01 • ID: {params.id}</p>
        </div>

        <button 
          onClick={() => { toast.success("Đã lưu sơ đồ!"); router.push('/admin/cinemas'); }} 
          className="bg-red-600 hover:bg-red-500 text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] active:scale-90"
        >
          Lưu Lại
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* --- CÔNG CỤ BÊN CẠNH --- */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-zinc-900/40 border border-white/5 p-7 rounded-[3rem] space-y-6 shadow-xl">
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] px-2">Bút vẽ thông minh</p>
            
            <div className="space-y-3">
              {/* Chế độ Tẩy */}
              <button
                onClick={() => setIsErasing(!isErasing)}
                className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all border ${
                  isErasing ? 'border-red-500 bg-red-500/10 shadow-lg scale-[1.02]' : 'border-white/5 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isErasing ? 'bg-red-500 text-white shadow-red-500/50 shadow-lg' : 'bg-zinc-800 text-zinc-500'}`}>
                  <Eraser size={20} />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-black uppercase text-white">Cọ Tẩy</span>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Xóa ghế đã chọn</span>
                </div>
              </button>

              <div className="h-px bg-white/5 my-2 mx-4" />

              {/* Các loại ghế */}
              {Object.entries(SEAT_TYPES).map(([key, value]) => (
                <button
                  key={key}
                  disabled={isErasing}
                  onClick={() => setSelectedType(key)}
                  className={`w-full flex items-center justify-between p-4 rounded-[2rem] transition-all border ${
                    selectedType === key && !isErasing
                    ? 'border-white/20 bg-white/10 scale-[1.02] shadow-xl' 
                    : 'border-transparent bg-transparent opacity-40 hover:opacity-100 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${value.color} ${value.glow} rounded-2xl flex items-center justify-center text-white transition-all ${selectedType === key ? 'scale-110 rotate-3' : ''}`}>
                      {value.icon}
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-black uppercase text-white">{value.label}</span>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase">Giá: {value.price}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Thao tác nhanh */}
            <div className="pt-4 border-t border-white/5 flex gap-3">
               <button onClick={() => setSeats({})} className="flex-1 py-4 bg-zinc-800/40 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 rounded-2xl text-[10px] font-black uppercase transition-all">Xóa Hết</button>
               <button onClick={() => {
                const full: Record<string, string> = {}; 
                rows.forEach(r => cols.forEach(c => full[`${r}${c}`] = selectedType)); 
                setSeats(full);
              }} className="flex-1 py-4 bg-zinc-800/40 hover:bg-white/10 text-zinc-500 hover:text-white rounded-2xl text-[10px] font-black uppercase transition-all">Phủ Kín</button>
            </div>
          </div>
        </div>

        {/* --- KHU VỰC THIẾT KẾ --- */}
        <div 
          className="xl:col-span-9 bg-[#070708] border border-white/5 rounded-[3.5rem] p-10 md:p-20 relative overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[750px] shadow-2xl"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          {/* Ánh sáng hắt từ màn hình */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[180px] bg-red-600/10 blur-[120px] pointer-events-none rounded-full" />

          {/* Màn hình Cinema */}
          <div className="relative mb-24 w-full max-w-2xl pointer-events-none group">
            <div className="w-full h-2 bg-gradient-to-r from-transparent via-zinc-800 to-transparent rounded-full opacity-50" />
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-zinc-500 to-transparent rounded-full blur-[2px]" />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase text-zinc-700 tracking-[2em] whitespace-nowrap">Màn Hình Chiếu</div>
          </div>

          {/* Sơ đồ ghế */}
          <div className="relative flex flex-col gap-3.5">
            {rows.map(row => (
              <div key={row} className="flex items-center gap-6">
                <span className="w-5 text-[11px] font-black text-zinc-800 italic">{row}</span>
                <div className="flex gap-2.5">
                  {cols.map(col => {
                    const seatId = `${row}${col}`;
                    const type = seats[seatId] || 'EMPTY';
                    const config = type !== 'EMPTY' ? SEAT_TYPES[type] : null;

                    return (
                      <div
                        key={col}
                        data-seat-id={seatId}
                        className={`w-9 h-9 rounded-xl transition-all duration-300 flex items-center justify-center relative cursor-crosshair
                          ${!config 
                            ? 'bg-zinc-900/80 border border-white/5 hover:border-white/20' 
                            : `${config.color} ${config.glow} scale-105 z-10`
                          }
                        `}
                      >
                        {config ? (
                          <div className="text-white/40 pointer-events-none scale-75 animate-in zoom-in-50">{config.icon}</div>
                        ) : (
                          <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                        )}
                        
                        {/* Hiệu ứng tia sáng khi di chuột (hover) */}
                        <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    );
                  })}
                </div>
                <span className="w-5 text-[11px] font-black text-zinc-800 italic text-right">{row}</span>
              </div>
            ))}
          </div>

          {/* Ghi chú loại ghế bên dưới */}
          <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-40 border-t border-white/5 pt-10">
             {Object.values(SEAT_TYPES).map((v, i) => (
               <div key={i} className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${v.color.split(' ')[0]} shadow-lg`} />
                 <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/80">{v.label}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}