import React from 'react';
import QuickPinchZoom from 'react-quick-pinch-zoom';
import { Minimize2 } from 'lucide-react';

const SeatMap = ({ rows, seatsPerRow, selectedSeats, onToggleSeat, onUpdate }: any) => {
  const imgRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 relative bg-[#020202] overflow-auto custom-scrollbar">
      <QuickPinchZoom onUpdate={onUpdate} wheelScaleFactor={0.05} tapZoomFactor={0} draggableUnZoomed={false}>
        <div ref={imgRef} className="p-20 md:p-32 inline-block min-w-full text-center origin-center transition-all duration-75">
          {/* Cinema Screen Decor */}
          <div className="max-w-md mx-auto mb-20 opacity-40">
            <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_15px_red]"></div>
            <p className="text-[16px] text-center text-red-600 font-black uppercase mt-4 tracking-[2em]">Màn hình</p>
          </div>

          {/* Grid Seats */}
          <div className="grid gap-3 select-none">
            {rows.map((row: string) => (
              <div key={row} className="flex gap-3 justify-center items-center">
                <span className="text-[10px] w-8 h-8 flex items-center justify-center text-white/10 font-black border border-white/5 rounded-lg">{row}</span>
                {Array.from({ length: seatsPerRow }).map((_, i) => {
                  const id = `${row}${i + 1}`;
                  const isSelected = selectedSeats.includes(id);
                  const isVip = ["D", "E", "F", "G"].includes(row);
                  const isOccupied = ["A5", "B10", "C12"].includes(id);
                  return (
                    <button
                      key={id}
                      disabled={isOccupied}
                      onClick={() => onToggleSeat(id)}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl text-[10px] font-black transition-all duration-300 border flex items-center justify-center shrink-0
                        ${isOccupied 
                          ? 'bg-zinc-900 border-zinc-900 text-zinc-800 cursor-not-allowed opacity-30'
                          : isSelected 
                            ? 'bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-110 z-10'
                            : isVip
                              ? 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-red-500/50 hover:bg-zinc-700'
                              : 'bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-zinc-200'}
                      `}
                    >
                      {id}
                    </button>
                  );
                })}
                <span className="text-[10px] w-8 h-8 flex items-center justify-center text-white/10 font-black border border-white/5 rounded-lg">{row}</span>
              </div>
            ))}
          </div>
        </div>
      </QuickPinchZoom>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
         <div className="flex items-center gap-4 bg-black/80 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10 shadow-2xl">
            <Minimize2 size={12} className="text-red-600"/>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Cuộn để trượt • Giữ Ctrl để Zoom</span>
         </div>
      </div>
    </div>
  );
};

export default SeatMap;