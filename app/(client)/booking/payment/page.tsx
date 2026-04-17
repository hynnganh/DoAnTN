"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { apiRequest } from '@/app/lib/api'; 
import toast, { Toaster } from 'react-hot-toast';
import { 
  Loader2, TicketCheck, ChevronLeft, TicketPercent, 
  Tag, Info, Banknote, CreditCard, Wallet, User, MapPin, Calendar
} from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // States cho Voucher & Thanh toán
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [loadingVoucher, setLoadingVoucher] = useState(true);

  useEffect(() => {
    // 1. Lấy dữ liệu đặt vé từ Session
    const sData = sessionStorage.getItem('booking_data');
    if (!sData) {
      toast.error("Phiên làm việc hết hạn!");
      return router.push('/');
    }
    setBookingData(JSON.parse(sData));

    // 2. Lấy thông tin User (Đồng bộ giống TopMenu của bạn)
    const fetchUserAndVouchers = async () => {
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (!token) return;

      try {
        // Lấy thông tin User
        const userRes = await apiRequest('/api/v1/users/me');
        if (userRes.ok) {
          const uResult = await userRes.json();
          setUserData(uResult.data?.user || uResult.data || uResult);
        }

        // Lấy danh sách Voucher
        const vRes = await apiRequest('/api/v1/vouchers');
        if (vRes.ok) {
          const vResult = await vRes.json();
          setVouchers(vResult.data || []);
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
        const stored = localStorage.getItem("user_info");
        if (stored) setUserData(JSON.parse(stored));
      } finally {
        setLoadingVoucher(false);
      }
    };

    fetchUserAndVouchers();
  }, []);

  const calculateFinalTotal = () => {
    const subTotal = (bookingData?.seatPrice || 0) + (bookingData?.comboPrice || 0);
    const discount = selectedVoucher ? selectedVoucher.discountValue : 0;
    return Math.max(0, subTotal - discount);
  };

  const handleFinalCheckout = async () => {
    setIsProcessing(true);
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      
      const payload = {
        showtimeId: Number(bookingData.showtimeId),
        seatIds: bookingData.selectedSeats.map((s: any) => s.id),
        combos: bookingData.selectedCombos.map((c: any) => ({ 
          comboId: c.id, 
          quantity: c.quantity 
        })),
        totalAmount: calculateFinalTotal(),
        paymentMethod: paymentMethod, 
        voucherCode: selectedVoucher?.code || "" 
      };

      const res = await apiRequest(`/api/v1/orders`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      const resData = await res.json();
      if (res.ok) {
        toast.success("Đặt vé thành công!");
        sessionStorage.removeItem('booking_data');
        router.push(`/booking/payment/${resData.data.id}`);
      } else {
        toast.error(resData.message || "Thanh toán thất bại!");
      }
    } catch (err) { 
      toast.error("Lỗi hệ thống!"); 
    } finally { 
      setIsProcessing(false); 
    }
  };

  if (!bookingData) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      <Toaster />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CỘT TRÁI: CHI TIẾT (8 CỘT) */}
        <div className="lg:col-span-8 space-y-6">
          <button onClick={() => router.back()} className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em]">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Quay lại
          </button>

          {/* 1. Thông tin người đặt */}
          <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] space-y-4">
            <h3 className="text-xs font-black uppercase italic text-red-600 flex items-center gap-2">
              <User size={14}/> Thông tin khách hàng
            </h3>
            {userData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xl font-black uppercase italic tracking-tighter">{userData.fullName || userData.username}</p>
                  <p className="text-[10px] text-zinc-500 font-bold">{userData.email}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Số điện thoại</p>
                  <p className="font-bold">{userData.phoneNumber || "N/A"}</p>
                </div>
              </div>
            ) : (
              <div className="h-12 bg-white/5 animate-pulse rounded-xl"></div>
            )}
          </div>

          {/* 2. Chi tiết Vé & Bắp nước */}
          <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem] space-y-8">
            <h3 className="text-xs font-black uppercase italic text-red-600">Chi tiết đơn hàng</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Phần phim */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 h-28 bg-zinc-800 rounded-xl overflow-hidden shrink-0 border border-white/5">
                    <img src={bookingData.movieImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-[1000] uppercase italic leading-none tracking-tighter">{bookingData.movieTitle}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">{bookingData.format} • {bookingData.duration} Phút</p>
                    <div className="flex items-center gap-1 text-[10px] text-red-500 font-black mt-2">
                      <MapPin size={10}/> {bookingData.cinemaName}
                    </div>
                  </div>
                </div>
                <div className="flex gap-8 py-4 border-t border-white/5">
                  <div>
                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Suất chiếu</p>
                    <p className="text-xs font-bold">{bookingData.time} - {bookingData.date}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Phòng chiếu</p>
                    <p className="text-xs font-bold">{bookingData.roomName}</p>
                  </div>
                </div>
              </div>

              {/* Phần ghế & combo */}
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-2">Ghế ngồi ({bookingData.selectedSeats.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {bookingData.selectedSeats.map((s: any) => (
                      <span key={s.id} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black">
                        {s.seatRow}{s.seatNumber}
                      </span>
                    ))}
                  </div>
                </div>

                {bookingData.selectedCombos.length > 0 && (
                  <div>
                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-2">Bắp nước đã chọn</p>
                    <div className="space-y-2">
                      {bookingData.selectedCombos.map((c: any) => (
                        <div key={c.id} className="flex justify-between text-[11px] font-bold">
                          <span className="text-zinc-400">{c.name} <span className="text-white italic">x{c.quantity}</span></span>
                          <span className="text-zinc-300">{(c.price * c.quantity).toLocaleString()}đ</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Voucher */}
          <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-xs font-black uppercase italic text-red-600 flex items-center gap-2">
              <TicketPercent size={14}/> Ưu đãi sẵn có
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vouchers.map((v) => (
                <button 
                  key={v.id}
                  onClick={() => setSelectedVoucher(selectedVoucher?.code === v.code ? null : v)}
                  className={`p-5 rounded-[1.5rem] border text-left transition-all relative overflow-hidden ${
                    selectedVoucher?.code === v.code ? 'bg-red-600 border-red-600' : 'bg-black/40 border-white/5 hover:border-red-600/40'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-[1000] italic uppercase">{v.code}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded ${selectedVoucher?.code === v.code ? 'bg-black/20' : 'bg-red-600 text-white'}`}>
                      -{v.discountValue.toLocaleString()}đ
                    </span>
                  </div>
                  <p className="text-[9px] font-bold opacity-60 line-clamp-1">{v.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: TỔNG KẾT (4 CỘT) */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-950 border border-white/10 p-10 rounded-[3.5rem] space-y-8 sticky top-8 shadow-2xl overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><Tag size={100} /></div>

            <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter italic">Hóa <span className="text-red-600">Đơn</span></h2>
            
            <div className="space-y-4 border-y border-white/5 py-8">
              <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                <span>Tổng tiền vé:</span> 
                <span className="text-white">{bookingData.seatPrice.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                <span>Tổng bắp nước:</span> 
                <span className="text-white">{bookingData.comboPrice.toLocaleString()}đ</span>
              </div>
              {selectedVoucher && (
                <div className="flex justify-between text-[10px] font-black uppercase text-green-500 bg-green-500/5 p-3 rounded-xl border border-green-500/10">
                  <span>Giảm giá:</span> 
                  <span>-{selectedVoucher.discountValue.toLocaleString()}đ</span>
                </div>
              )}
              
              {/* Chọn phương thức thanh toán */}
              <div className="pt-4 space-y-3">
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest text-center">Phương thức thanh toán</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CASH', icon: <Banknote size={16}/> },
                    { id: 'VNPAY', icon: <Wallet size={16}/> },
                    { id: 'BANK', icon: <CreditCard size={16}/> }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex justify-center py-3 rounded-xl border transition-all ${
                        paymentMethod === m.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-zinc-500'
                      }`}
                    >
                      {m.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                <span className="text-[10px] font-black uppercase text-zinc-400 pb-1 italic">Thành tiền:</span>
                <span className="text-4xl font-[1000] italic text-red-600 tracking-tighter">
                  {calculateFinalTotal().toLocaleString()}đ
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleFinalCheckout} 
                disabled={isProcessing}
                className="w-full py-6 bg-red-600 rounded-3xl font-[1000] italic uppercase tracking-[0.2em] hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-[0_20px_50px_rgba(220,38,38,0.3)]"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <><TicketCheck size={26}/> Xác nhận</>}
              </button>
              
              <div className="flex items-start gap-3 p-5 bg-zinc-900/50 rounded-2xl border border-white/5">
                <Info size={16} className="text-zinc-600 mt-1 shrink-0" />
                <p className="text-[9px] text-zinc-500 font-bold uppercase leading-relaxed tracking-tight">
                  Vui lòng kiểm tra kỹ thông tin. Vé đã mua không thể hoàn trả.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}