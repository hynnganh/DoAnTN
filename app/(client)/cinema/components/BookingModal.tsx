"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Check, AlertCircle, Loader2, Clock } from 'lucide-react';
import SeatMap from './SeatMap';
import PaymentView from './PaymentView';
import { apiRequest } from '@/app/lib/api'; 

export interface SeatType {
  id: number;
  name: string | null;        
  seatRow: string;     
  seatNumber: string;  
  seatLabel: string;   
  seatType: string;    
  price: number;
  status?: string;     
}

export default function BookingModal({ info, onClose }: any) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const [step, setStep] = useState(1); 
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
  const [dbSeats, setDbSeats] = useState<SeatType[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingSeats, setFetchingSeats] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'info' } | null>(null);
  const [qrContent, setQrContent] = useState<string>("");
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);

  const showToast = (msg: string, type: 'error' | 'info' = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const stId = info.id || info.showtimeId;
    if (!isMounted || !stId) return;

    const fetchSeats = async () => {
      setFetchingSeats(true);
      try {
        const res = await apiRequest(`/api/v1/seats/showtime/${stId}`);
        if (res.ok) {
          const result = await res.json();
          const rawSeats = result.data || [];
          setDbSeats(rawSeats.map((s: any) => ({
            ...s,
            seatLabel: s.name || `${s.seatRow}${parseInt(s.seatNumber)}`
          })));
        }
      } catch (err) {
        showToast("Không thể tải sơ đồ ghế!");
      } finally {
        setFetchingSeats(false);
      }
    };
    fetchSeats();
  }, [info.id, info.showtimeId, isMounted]);

  const toggleSeat = useCallback((seat: SeatType) => {
    setSelectedSeats((prev) => {
      const isExist = prev.find((s) => s.id === seat.id);
      if (isExist) return prev.filter((s) => s.id !== seat.id);
      if (prev.length >= 8) { showToast("Tối đa 8 ghế!"); return prev; }

      const rowName = seat.seatRow;
      const seatNum = parseInt(seat.seatNumber);
      const occupiedInRow = dbSeats.filter((s) => s.seatRow === rowName && s.status === 'OCCUPIED').map((s) => parseInt(s.seatNumber));
      const selectingInRow = prev.filter((s) => s.seatRow === rowName).map((s) => parseInt(s.seatNumber));
      const allTaken = [...occupiedInRow, ...selectingInRow];

      if ((allTaken.includes(seatNum + 2) && !allTaken.includes(seatNum + 1)) || 
          (allTaken.includes(seatNum - 2) && !allTaken.includes(seatNum - 1))) {
        showToast("Không được để trống 1 ghế ở giữa!");
        return prev;
      }
      return [...prev, seat].sort((a, b) => a.seatLabel.localeCompare(b.seatLabel, undefined, { numeric: true }));
    });
  }, [dbSeats]);

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) return;
    setLoading(true);
    try {
      const orderRequest = {
        showtimeId: info.id || info.showtimeId,
        seatIds: selectedSeats.map(s => s.id),
        totalAmount: selectedSeats.reduce((sum, s) => sum + s.price, 0),
        paymentMethod: paymentMethod.toUpperCase()
      };
      const orderRes = await apiRequest(`/api/v1/orders`, { method: 'POST', body: JSON.stringify(orderRequest) });
      const orderData = await orderRes.json();
      if (orderRes.ok) {
        setCurrentOrderId(orderData.data.id);
        const payRes = await apiRequest(`/api/v1/payments/order/${orderData.data.id}`, { method: 'POST' });
        const payData = await payRes.json();
        if (payRes.ok) { setQrContent(payData.data.qrContent); setStep(2); }
      } else { showToast(orderData.message || "Ghế đã có người đặt!"); }
    } catch (error) { showToast("Lỗi thanh toán!"); } finally { setLoading(false); }
  };

  const handleConfirmPaid = async () => {
    if (!currentOrderId) return;
    setLoading(true);
    try {
      const res = await apiRequest(`/api/v1/payments/confirm/${currentOrderId}`, { method: 'PUT' });
      if (res.ok) { setIsSuccess(true); setTimeout(() => { onClose(); window.location.reload(); }, 2500); }
      else { showToast("Xác nhận thất bại!"); }
    } catch (error) { showToast("Lỗi server!"); } finally { setLoading(false); }
  };

  const totalAmount = useMemo(() => selectedSeats.reduce((sum, s) => sum + s.price, 0), [selectedSeats]);
  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  useEffect(() => {
    if (step === 1 && selectedSeats.length > 0 && isMounted) {
      const timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
      if (timeLeft === 0) { showToast("Hết thời gian giữ chỗ!"); setTimeout(onClose, 1500); }
      return () => clearInterval(timer);
    }
  }, [timeLeft, selectedSeats.length, step, onClose, isMounted]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative z-10 bg-[#0a0a0a] w-full max-w-7xl h-[94vh] rounded-[3rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl">
        
        {toast && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[110] bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl">
            <AlertCircle size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">{toast.msg}</span>
          </div>
        )}

        {isSuccess && (
          <div className="absolute inset-0 z-[120] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-700 backdrop-blur-md">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/50"><Check size={48} className="text-white stroke-[4]" /></div>
            <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">Đặt vé thành công!</h2>
          </div>
        )}

        {/* HEADER */}
        <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div>
            <h2 className="text-white text-2xl font-[1000] italic uppercase tracking-tighter leading-none">{info.title}</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">{info.time} • {step === 1 ? 'Chọn ghế' : 'Thanh toán'}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-600 transition-all text-white"><X size={18}/></button>
        </div>

        {/* CHÚ THÍCH (LEGEND) - Đưa ra ngoài SeatMap để không bị tràn */}
        {step === 1 && (
          <div className="bg-black/20 border-b border-white/5 py-4 flex justify-center gap-8">
            {[
              { label: 'Thường', cls: 'bg-zinc-900 border-zinc-700' },
              { label: 'VIP', cls: 'border-amber-600/50 text-amber-600 bg-zinc-900/40' },
              { label: 'Đang chọn', cls: 'bg-red-600 border-red-600 text-white' },
              { label: 'Đã đặt', cls: 'text-zinc-700 border-none' }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border text-[5px] flex items-center justify-center font-bold ${item.cls}`}>
                  {item.label === 'Đã đặt' ? 'A1' : ''}
                </div>
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-hidden relative bg-black">
          {fetchingSeats ? (
             <div className="h-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-red-600" size={32} />
                <p className="text-[10px] font-black uppercase text-zinc-600">Đang đồng bộ sơ đồ rạp...</p>
             </div>
          ) : dbSeats.length > 0 ? (
             step === 1 ? (
                <SeatMap dbSeats={dbSeats} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
             ) : (
                <PaymentView info={info} selectedSeats={selectedSeats.map(s => s.seatLabel)} totalPrice={totalAmount} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} onBack={() => setStep(1)} onConfirm={handleConfirmPaid} loading={loading} qrContent={qrContent} />
             )
          ) : (
             <div className="h-full flex items-center justify-center text-red-500 font-black uppercase">Không tìm thấy dữ liệu ghế!</div>
          )}
        </div>

        {/* FOOTER */}
        {step === 1 && dbSeats.length > 0 && (
          <div className="p-8 md:px-14 bg-[#080808] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                 <span className="text-[9px] text-zinc-600 font-black uppercase italic">Ghế đã chọn:</span>
                 <div className="flex gap-2"> 
                    {selectedSeats.length > 0 ? selectedSeats.map(s => (<span key={s.id} className="text-red-600 font-[1000] italic text-xl">{s.seatLabel}</span>)) : <span className="text-zinc-800 italic text-sm">...</span>} 
                 </div>
              </div>
              <div className="text-4xl font-[1000] text-white italic tracking-tighter">{totalAmount.toLocaleString()} <span className="text-red-600 text-[10px] uppercase ml-1 font-black">VND</span></div>
            </div>
            <div className="flex items-center gap-8">
              {selectedSeats.length > 0 && <div className="text-red-600 font-mono font-black text-xl flex items-center gap-2"><Clock size={16} /> <span>{formatTime(timeLeft)}</span></div>}
              <button 
                onClick={handleProceedToPayment} 
                disabled={selectedSeats.length === 0 || loading} 
                className="px-14 py-5 bg-red-600 hover:bg-red-500 disabled:bg-zinc-900 disabled:text-zinc-500 text-white rounded-full font-[1000] uppercase text-[12px] shadow-xl transition-all"
              >
                {loading ? "Đang xử lý..." : "Tiếp tục thanh toán"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
