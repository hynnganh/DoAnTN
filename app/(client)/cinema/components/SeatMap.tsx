"use client";
import React, { useRef, useMemo } from 'react';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import { SeatType } from './BookingModal';

interface SeatMapProps {
  dbSeats: SeatType[];
  selectedSeats: SeatType[];
  onToggleSeat: (seat: SeatType) => void;
}

const SeatMap = ({ dbSeats = [], selectedSeats = [], onToggleSeat }: SeatMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Tính toán danh sách hàng và số ghế tối đa
  const uniqueRows = useMemo(() => Array.from(new Set(dbSeats.map(s => s.seatRow))).sort(), [dbSeats]);
  const maxSeatsInRow = useMemo(() => Math.max(...dbSeats.map(s => parseInt(s.seatNumber) || 0), 0), [dbSeats]);

  // 2. Hàm xử lý Zoom mượt mà
  const onUpdate = useCallback(({ x, y, scale }: any) => {
    if (containerRef.current) {
      const value = make3dTransformValue({ x, y, scale });
      containerRef.current.style.setProperty('transform', value);
    }
  }, []);

  return (
    <div className="w-full h-full relative bg-[#020202] overflow-hidden">
      <QuickPinchZoom 
        onUpdate={onUpdate} 
        wheelScaleFactor={0.05} 
        draggableUnZoomed={true}
        inertia={true}
        tapZoomFactor={1.5}
      >
        <div 
          ref={containerRef} 
          className="inline-block origin-[0_0] will-change-transform py-20 px-10 min-w-full"
        >
          {/* Màn hình Cinematic */}
          <div className="max-w-[400px] mx-auto mb-20 relative">
             <div className="w-full h-[4px] bg-red-600 shadow-[0_0_40px_rgba(220,38,38,1)] rounded-full"></div>
             <div className="w-full h-32 bg-gradient-to-t from-transparent to-red-600/10 absolute top-0 blur-3xl opacity-50"></div>
             <p className="text-[10px] text-red-600/40 font-black uppercase mt-6 tracking-[2em] text-center ml-[2em]">Màn hình</p>
          </div>

          {/* Grid Ghế ngồi - Căn giữa tự động */}
          <div className="flex flex-col gap-4 items-center justify-center">
            {uniqueRows.map((rowName) => (
              <div key={rowName} className="flex gap-3 items-center">
                {/* Tên hàng bên trái */}
                <span className="text-[10px] w-6 text-white/10 font-black uppercase text-right">{rowName}</span>
                
                <div className="flex gap-2.5">
                  {Array.from({ length: maxSeatsInRow }, (_, i) => {
                    const currentNum = i + 1;
                    const seatData = dbSeats.find(s => s.seatRow === rowName && parseInt(s.seatNumber) === currentNum);
                    
                    if (!seatData) return <div key={i} className="w-10 h-10 opacity-0" />;

                    const isOccupied = seatData.status === 'OCCUPIED';
                    const isSelected = selectedSeats.some(s => s.id === seatData.id);
                    const isVip = seatData.seatType?.toUpperCase() === 'VIP';
                    const label = seatData.name || `${rowName}${currentNum}`;

                    return (
                      <button
                        key={seatData.id}
                        disabled={isOccupied}
                        onClick={() => onToggleSeat(seatData)}
                        className={`
                          w-10 h-10 text-[10px] font-black transition-all duration-300 flex items-center justify-center shrink-0
                          ${isOccupied 
                            ? 'bg-transparent border-none text-zinc-800 cursor-not-allowed italic font-medium scale-90' 
                            : isSelected 
                              ? 'bg-red-600 border-red-600 text-white rounded-xl shadow-[0_0_25px_red] scale-110 z-10' 
                              : isVip
                                ? 'bg-zinc-900/40 border border-amber-600/40 text-amber-600 rounded-xl hover:border-amber-600 hover:bg-amber-600/10' 
                                : 'bg-zinc-900/60 border border-zinc-700 text-zinc-400 rounded-xl hover:border-zinc-400 hover:bg-white/5'
                          }
                        `}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Tên hàng bên phải */}
                <span className="text-[10px] w-6 text-white/10 font-black uppercase text-left">{rowName}</span>
              </div>
            ))}
          </div>
          
          {/* Padding dưới để nội dung không bị sát mép khi zoom */}
          <div className="h-40"></div>
        </div>
      </QuickPinchZoom>
    </div>
  );
};

// Hàm bổ trợ để toggle seat mượt mà hơn
import { useCallback } from 'react';

export default SeatMap;
