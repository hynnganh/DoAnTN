"use client";
import React, { useRef, useMemo } from 'react';
import QuickPinchZoom from 'react-quick-pinch-zoom';
import { Armchair, Heart, Loader2 } from 'lucide-react';
import { SeatType } from './BookingModal';

interface SeatMapProps {
  dbSeats: SeatType[];
  selectedSeats: SeatType[];
  onToggleSeat: (seat: SeatType) => void;
  loading?: boolean;
}

const SeatMap = ({ dbSeats = [], selectedSeats = [], onToggleSeat, loading }: SeatMapProps) => {
  const imgRef = useRef<HTMLDivElement>(null);

  // Lấy danh sách hàng ghế duy nhất và sắp xếp
  const rows = useMemo(() => {
    return Array.from(new Set(dbSeats.map(s => s.seatRow))).sort();
  }, [dbSeats]);

  const onUpdate = ({ x, y, scale }: any) => {
    if (imgRef.current) {
      imgRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#020202]">
      <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
      <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest italic">Đang tải sơ đồ phòng...</p>
    </div>
  );

  return (
    <div className="flex-1 relative bg-[#020202] overflow-hidden min-h-[500px] cursor-grab active:cursor-grabbing">
      <QuickPinchZoom onUpdate={onUpdate} wheelScaleFactor={0.05} tapZoomFactor={0.15} draggableUnZoomed={true}>
        <div ref={imgRef} className="p-20 md:p-14 inline-block min-w-full text-center origin-center" style={{ touchAction: 'none' }}>
          
          {/* MÀN HÌNH */}
          <div className="max-w-lg mx-auto mb-24 opacity-30">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-400 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]"></div>
            <p className="text-[7px] text-center text-zinc-700 font-black uppercase mt-4 tracking-[3em] ml-[3em]">Màn hình</p>
          </div>

          {/* GRID GHẾ */}
          <div className="flex flex-col gap-4 select-none">
            {rows.map((rowName) => (
              <div key={rowName} className="flex gap-3 justify-center items-center">
                <span className="text-[12px] w-8 text-zinc-800 font-black italic">{rowName}</span>
                
                {dbSeats
                  .filter(s => s.seatRow === rowName)
                  .sort((a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber))
                  .map((seat) => {
                    const isOccupied = seat.status !== 'AVAILABLE'; 
                    const isSelected = selectedSeats.some((s) => s.id === seat.id);
                    const isVip = seat.seatType === 'VIP';
                    const isSweet = seat.seatType === 'SWEETBOX';
                    
                    const displayLabel = seat.name || `${seat.seatRow}${seat.seatNumber}`;

                    return (
                      <button
                        key={seat.id}
                        disabled={isOccupied}
                        onClick={() => onToggleSeat(seat)}
                        className={`
                          relative rounded-xl text-[10px] font-black transition-all duration-300 border flex flex-col items-center justify-center shrink-0
                          ${isSweet ? 'w-24 h-11' : 'w-11 h-11'}
                          ${isOccupied 
                            ? 'bg-zinc-900/40 border-zinc-900 text-zinc-900 opacity-20 cursor-not-allowed' 
                            : isSelected 
                              ? 'bg-red-600 border-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.5)] scale-105 z-10' 
                              : isSweet
                                ? 'bg-pink-950/20 border-pink-500/40 text-pink-500 hover:border-pink-500 hover:bg-pink-500/10'
                                : isVip
                                  ? 'bg-zinc-900/40 border-amber-500/30 text-amber-500/90 hover:border-amber-500 hover:bg-amber-500/10' 
                                  : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:border-white/40 hover:text-white'}
                        `}
                      >
                        {isSweet ? (
                          <Heart size={14} className={`mb-0.5 ${isSelected ? 'opacity-100' : 'opacity-40'}`} />
                        ) : (
                          <Armchair size={12} className={`mb-0.5 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                        )}
                        <span className="leading-none">{displayLabel}</span>
                      </button>
                    );
                  })}
                <span className="text-[12px] w-8 text-zinc-800 font-black italic">{rowName}</span>
              </div>
            ))}
          </div>

          {/* CHÚ THÍCH (LEGEND) */}
          <div className="mt-20 flex flex-wrap justify-center gap-8 py-6 border-t border-white/5 bg-zinc-950/30 rounded-[3rem] px-12">
              <LegendItem label="Thường" cls="bg-zinc-900/60 border-white/10" />
              <LegendItem label="Vip" cls="border-amber-500/30 text-amber-500 bg-amber-500/5" />
              <LegendItem label="Sweetbox" cls="border-pink-500/40 text-pink-500 bg-pink-500/5" />
              <LegendItem label="Đang chọn" cls="bg-red-600 border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.3)]" />
              <LegendItem label="Đã đặt" cls="bg-zinc-900/20 border-zinc-900 opacity-20" />
          </div>
        </div>
      </QuickPinchZoom>
    </div>
  );
};

const LegendItem = ({ label, cls }: any) => (
  <div className="flex items-center gap-2.5">
     <div className={`w-4 h-4 rounded-md border ${cls}`}></div>
     <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{label}</span>
  </div>
);

export default SeatMap;