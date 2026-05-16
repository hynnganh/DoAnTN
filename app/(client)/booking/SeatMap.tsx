"use client";
import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import { Heart, Armchair } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export interface SeatType {
  id: number | string;
  seatRow: string;
  seatNumber: string;
  status: string;
  seatType: string;
  name?: string;
  price?: number;
}

interface SeatMapProps {
  dbSeats: SeatType[];
  selectedSeats: SeatType[];
  onToggleSeat: (seat: SeatType) => void;
}

const SeatMap = ({ dbSeats = [], selectedSeats = [], onToggleSeat }: SeatMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Lấy danh sách hàng ghế (A, B, C...) và sắp xếp theo thứ tự
  const uniqueRows = useMemo(() => 
    Array.from(new Set(dbSeats.map(s => s.seatRow))).sort(), 
    [dbSeats]
  );
  
  // 2. Tìm số ghế lớn nhất trong tất cả các hàng để làm khung Grid
  const maxSeatsInRow = useMemo(() => 
    Math.max(...dbSeats.map(s => parseInt(s.seatNumber) || 0), 0), 
    [dbSeats]
  );

  // 3. Đảm bảo useCallback được sử dụng đúng cách cho hiệu năng zoom
  const onUpdate = useCallback(({ x, y, scale }: any) => {
    if (containerRef.current) {
      const value = make3dTransformValue({ x, y, scale });
      containerRef.current.style.setProperty('transform', value);
    }
  }, []);

  // ================= THUẬT TOÁN CHỐNG ĐỂ TRỐNG GHẾ ĐƠN LẺ REAL-TIME =================
  const validateSeatSelection = useCallback((clickedSeat: SeatType): boolean => {
    // Mô phỏng danh sách ghế ĐÃ CHỌN mới nếu như thực hiện cú click này
    const isCurrentlySelected = selectedSeats.some(s => s.id === clickedSeat.id);
    const simulatedSelected = isCurrentlySelected
      ? selectedSeats.filter(s => s.id !== clickedSeat.id)
      : [...selectedSeats, clickedSeat];

    // Duyệt qua từng hàng ghế độc lập để kiểm tra
    for (const row of uniqueRows) {
      const rowSeats = dbSeats
        .filter(s => s.seatRow === row)
        .sort((a, b) => (parseInt(a.seatNumber) || 0) - (parseInt(b.seatNumber) || 0));

      const len = rowSeats.length;
      for (let i = 0; i < len; i++) {
        const currentSeat = rowSeats[i];
        const statusStr = String(currentSeat.status).toUpperCase();
        const isOccupied = statusStr === 'OCCUPIED' || statusStr === 'SOLD';
        const isSimSelected = simulatedSelected.some(s => s.id === currentSeat.id);

        // Trạng thái ghế trống sau khi giả định lượt click diễn ra thành công
        const isFreePostBooking = !isOccupied && !isSimSelected;

        if (isFreePostBooking) {
          // Kiểm tra biên chặn bên trái (Có thể là tường rạp hoặc ghế đã bị chiếm/được chọn)
          let leftBlocked = false;
          if (i === 0) {
            leftBlocked = true; 
          } else {
            const leftSeat = rowSeats[i - 1];
            const leftOccupied = String(leftSeat.status).toUpperCase() === 'OCCUPIED' || String(leftSeat.status).toUpperCase() === 'SOLD';
            const leftSimSelected = simulatedSelected.some(s => s.id === leftSeat.id);
            if (leftOccupied || leftSimSelected) leftBlocked = true;
          }

          // Kiểm tra biên chặn bên phải (Có thể là tường rạp hoặc ghế đã bị chiếm/được chọn)
          let rightBlocked = false;
          if (i === len - 1) {
            rightBlocked = true; 
          } else {
            const rightSeat = rowSeats[i + 1];
            const rightOccupied = String(rightSeat.status).toUpperCase() === 'OCCUPIED' || String(rightSeat.status).toUpperCase() === 'SOLD';
            const rightSimSelected = simulatedSelected.some(s => s.id === rightSeat.id);
            if (rightOccupied || rightSimSelected) rightBlocked = true;
          }

          // Nếu cả 2 bên của một ghế trống đều bị chặn cứng -> Ghế này bị cô lập lẻ loi!
          if (leftBlocked && rightBlocked) {
            // Xác thực xem vết nghẽn ghế này có tác động/liên quan trực tiếp từ các ghế user đang chọn không
            let causedByUser = false;
            if (i > 0 && simulatedSelected.some(s => s.id === rowSeats[i - 1].id)) causedByUser = true;
            if (i < len - 1 && simulatedSelected.some(s => s.id === rowSeats[i + 1].id)) causedByUser = true;

            if (causedByUser) {
              const label = currentSeat.name || `${currentSeat.seatRow}${currentSeat.seatNumber}`;
              toast.error(`Không được để lại ghế trống đơn lẻ (${label}) ở giữa hoặc đầu hàng!`);
              return false; // Vi phạm ràng buộc, không cho click tiếp
            }
          }
        }
      }
    }
    return true; // Hợp lệ, cho phép xử lý tiếp hành động
  }, [dbSeats, selectedSeats, uniqueRows]);

  // Hàm trung gian xử lý sự kiện click chuột chọn ghế
  const handleSeatClick = (seat: SeatType) => {
    const isValid = validateSeatSelection(seat);
    if (isValid) {
      onToggleSeat(seat); // Nếu hợp lệ thì mới đẩy data ra ngoài component cha
    }
  };

  return (
    <div className="w-full h-full min-h-[800px] relative bg-[#010101] overflow-hidden p-4 md:p-5">
      <Toaster position="top-center" reverseOrder={false} />
      
      <QuickPinchZoom 
        onUpdate={onUpdate} 
        wheelScaleFactor={0.05} 
        draggableUnZoomed={true}
        inertia={true}
        tapZoomFactor={1.5}
      >
        <div 
          ref={containerRef} 
          className="inline-block origin-[0_0] will-change-transform px-3 min-w-full scale-[0.95] md:scale-100 text-center"
        >
          <div className="max-w-[400px] mx-auto mb-16 relative">
             <div className="w-full h-[3px] bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8)] rounded-full"></div>
             <div className="w-full h-24 bg-gradient-to-t from-transparent to-red-600/5 absolute top-0 blur-3xl opacity-40"></div>
             <p className="text-[9px] text-red-600/30 font-black uppercase mt-5 tracking-[1.5em] text-center ml-[1.5em]">Màn hình</p>
          </div>

          <div className="flex flex-col gap-3 items-center justify-center">
            {uniqueRows.map((rowName) => (
              <div key={rowName} className="flex gap-5 items-center">
                <span className="text-[10px] w-6 text-white/10 font-black uppercase text-right select-none">{rowName}</span>
                
                <div className="flex gap-2.5">
                  {Array.from({ length: maxSeatsInRow }, (_, i) => {
                    const currentNum = i + 1;
                    const seatData = dbSeats.find(s => s.seatRow === rowName && parseInt(s.seatNumber) === currentNum);
                    
                    if (!seatData) return <div key={i} className="w-9 h-9 opacity-0" />;

                    const statusStr = String(seatData.status).toUpperCase();
                    const isOccupied = statusStr === 'OCCUPIED' || statusStr === 'SOLD';
                    const isSelected = selectedSeats.some(s => s.id === seatData.id);
                    
                    const type = seatData.seatType?.toUpperCase();
                    const isSweet = type === 'SWEETBOX' || type === 'COUPLE';
                    const isVip = type === 'VIP';
                    const label = seatData.name || `${rowName}${currentNum}`;

                    return (
                      <button
                        key={seatData.id}
                        disabled={isOccupied}
                        onClick={() => handleSeatClick(seatData)} // Thay đổi hàm gọi tại đây
                        className={`
                          relative transition-all duration-300 flex flex-col items-center justify-center shrink-0 rounded-xl border
                          ${isSweet ? 'w-20 h-10' : 'w-9 h-9'} 
                          ${isOccupied 
                            ? 'bg-transparent border-none text-zinc-800 cursor-not-allowed opacity-20 scale-90' 
                            : isSelected 
                              ? 'bg-red-600 border-red-500 text-white shadow-[0_0_25px_red] scale-110 z-10' 
                              : isSweet
                                ? 'bg-pink-500/5 border-pink-500/30 text-pink-500 hover:border-pink-500 hover:bg-pink-500/10'
                                : isVip
                                  ? 'bg-amber-600/5 border-amber-600/30 text-amber-600 hover:border-amber-600 hover:bg-amber-600/10'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-white'
                          }
                        `}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          {isSweet ? (
                            <Heart size={14} className={`${isSelected ? 'fill-white' : 'fill-pink-500/40'}`} />
                          ) : (
                            <Armchair size={12} className={`opacity-40 ${isVip && !isSelected ? 'text-amber-600' : ''}`} />
                          )}
                          <span className={`font-black tracking-tighter ${isSweet ? 'text-[8px]' : 'text-[9px]'}`}>
                            {label}
                          </span>
                        </div>
                        
                        {isSelected && (
                          <div className="absolute inset-0 rounded-xl bg-white/10 animate-pulse pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <span className="text-[10px] w-6 text-white/10 font-black uppercase text-left select-none">{rowName}</span>
              </div>
            ))}
          </div>
          
          <div className="h-40"></div>
        </div>
      </QuickPinchZoom>
    </div>
  );
};

export default SeatMap;