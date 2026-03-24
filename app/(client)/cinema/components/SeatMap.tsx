"use client";
import React, { useMemo, useRef } from 'react';
import QuickPinchZoom from 'react-quick-pinch-zoom';
import { Minimize2 } from 'lucide-react';

const SeatMap = ({ dbSeats = [], selectedSeats = [], onToggleSeat }: any) => {
  const imgRef = useRef<HTMLDivElement>(null);

  // Cấu hình: 10 hàng, mỗi hàng 14 ghế (Dễ dàng thay đổi)
  const ROWS_CONFIG = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const SEATS_PER_ROW = 14;

  const onUpdate = ({ x, y, scale }: any) => {
    if (imgRef.current) {
      imgRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }
  };

  return (
    <div className="flex-1 relative bg-[#020202] overflow-hidden min-h-[500px] cursor-grab active:cursor-grabbing">
      <QuickPinchZoom 
        onUpdate={onUpdate} 
        wheelScaleFactor={0.05} 
        tapZoomFactor={0.15}
        draggableUnZoomed={true}
      >
        <div 
          ref={imgRef} 
          className="p-10 md:p-24 inline-block min-w-full text-center origin-center transition-all duration-75"
          style={{ touchAction: 'none' }} 
        >
          {/* Màn hình Cinema */}
          <div className="max-w-xs mx-auto mb-16 opacity-30">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_15px_red]"></div>
            <p className="text-[10px] text-center text-red-600 font-black uppercase mt-2 tracking-[1.5em]">Màn hình</p>
          </div>

          {/* Grid ghế dạng A1, A2... */}
          <div className="grid gap-1.5 select-none">
            {ROWS_CONFIG.map((rowName) => (
              <div key={rowName} className="flex gap-1.5 justify-center items-center">
                <span className="text-[8px] w-6 h-6 flex items-center justify-center text-white/10 font-bold border border-white/5 rounded-md">{rowName}</span>
                
                {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                  const seatNo = (i + 1).toString();
                  const seatLabel = `${rowName}${seatNo}`;
                  
                  // Kiểm tra xem ghế này đã được mua (có trong DB) chưa
                  const occupiedSeat = dbSeats.find(
                    (s: any) => s.seatRow === rowName && s.seatNumber === seatNo
                  );

                  const isOccupied = !!occupiedSeat;
                  const isSelected = selectedSeats.some((s: any) => s.seatLabel === seatLabel);
                  const isVip = ['E', 'F', 'G', 'H'].includes(rowName);

                  return (
                    <button
                      key={seatLabel}
                      disabled={isOccupied}
                      onClick={() => onToggleSeat({ row: rowName, num: seatNo, isVip, seatLabel, price: isVip ? 210000 : 165000 })}
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-lg text-[7px] font-bold transition-all duration-300 border flex items-center justify-center shrink-0
                        ${isOccupied 
                          ? 'bg-zinc-900 border-zinc-900 text-zinc-800 cursor-not-allowed opacity-20' 
                          : isSelected 
                            ? 'bg-red-600 border-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)] scale-110 z-10' 
                            : isVip
                              ? 'bg-zinc-800/40 border-amber-500/30 text-amber-500/80 hover:border-amber-500' 
                              : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:border-zinc-500'}
                      `}
                    >
                      {seatLabel}
                    </button>
                  );
                })}
                
                <span className="text-[8px] w-6 h-6 flex items-center justify-center text-white/10 font-bold border border-white/5 rounded-md">{rowName}</span>
              </div>
            ))}
          </div>

          {/* Chú thích trạng thái */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 opacity-50">
             {[
               { label: 'Thường', cls: 'bg-zinc-900 border-zinc-800' },
               { label: 'VIP', cls: 'border-amber-500/50 text-amber-500' },
               { label: 'Đang chọn', cls: 'bg-red-600 border-red-600' },
               { label: 'Đã đặt', cls: 'bg-zinc-900 opacity-20' }
             ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                   <div className={`w-3 h-3 rounded-sm border ${item.cls}`}></div>
                   <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-tighter">{item.label}</span>
                </div>
             ))}
          </div>
        </div>
      </QuickPinchZoom>
    </div>
  );
};

export default SeatMap;