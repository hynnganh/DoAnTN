"use client";
import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode'; 
import { 
  Camera, 
  RefreshCw, 
  Ticket, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Armchair, 
  Coffee, 
  FlipHorizontal, 
  Calendar, 
  MapPin 
} from 'lucide-react';
import toast from 'react-hot-toast'; 

export default function StaffScannerPage() {
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [scannerEnabled, setScannerEnabled] = useState(true);
  const [isMirrored, setIsMirrored] = useState(false); 

  useEffect(() => {
    if (!scannerEnabled) return;

    const html5QrCode = new Html5Qrcode("reader");
    let isMounted = true;

    const startScanner = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (!isMounted) return;

        await html5QrCode.start(
          { facingMode: "environment" }, 
          {
            fps: 15, 
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.65;
              return { width: size, height: size };
            }
          },
          async (decodedText) => {
            if (html5QrCode.isScanning) {
              await html5QrCode.stop(); 
            }
            setScannerEnabled(false);
            await fetchOrderDetails(decodedText);
          },
          (errorMessage) => {}
        );
      } catch (err) {
        console.error("Lỗi khởi động camera:", err);
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop()
          .then(() => html5QrCode.clear())
          .catch((err) => console.error("Lỗi giải phóng camera:", err));
      }
    };
  }, [scannerEnabled]);

  // 1. HÀM QUÉT KIỂM TRA THÔNG TIN VÉ BAN ĐẦU (GET)
  const fetchOrderDetails = async (qrContent: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token_admin");

      const res = await fetch(`http://localhost:8080/api/v1/orders/scan?qrContent=${encodeURIComponent(qrContent)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        }
      });
      
      const result = await res.json();

      if (res.ok && result.status === 200) {
        setOrderData(result.data);
        toast.success("Mã QR hợp lệ! Vui lòng đối chiếu vật phẩm.");
      } else {
        setError(result.message || "Mã QR không hợp lệ hoặc đã hết hạn!");
      }
    } catch (err) {
      setError("Mất kết nối tới máy chủ Backend Spring Boot!");
    } finally { // 🔥 ĐÃ SỬ CHUẨN CHÍNH TẢ: finally
      setLoading(false);
    }
  };

  // 2. HÀM XỬ LÝ KHI ẤN NÚT XÁC NHẬN BÀN GIAO VÉ (PUT ĐỔI SANG TRẠNG THÁI USED)
  const handleConfirmCheckIn = async () => {
    if (!orderData) return;

    setConfirmLoading(true);
    try {
      const token = localStorage.getItem("token_admin");
      const res = await fetch(`http://localhost:8080/api/v1/orders/${orderData.id}/confirm-checkin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        }
      });

      const result = await res.json();

      if (res.ok && result.status === 200) {
        toast.success("Đã hoàn tất! Vé đã được chuyển sang trạng thái ĐÃ SỬ DỤNG.");
        handleResetScanner();
      } else {
        toast.error(result.message || "Không thể xác nhận soát vé!");
      }
    } catch (err) {
      toast.error("Mất kết nối, không thể cập nhật trạng thái vé!");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleResetScanner = () => {
    setOrderData(null);
    setError(null);
    setScannerEnabled(true);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-zinc-100 font-sans p-8 flex flex-col items-center justify-center relative overflow-hidden select-none w-full">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-6 max-w-md w-full relative z-10">
        <div className="inline-flex p-3 bg-red-600/10 border border-red-600/20 rounded-2xl mb-3 text-red-500 shadow-lg shadow-red-900/20 animate-pulse">
          <Camera size={22} />
        </div>
        <h1 className="text-lg font-black uppercase tracking-widest text-white flex items-center justify-center gap-2">
          A&K Cinema <span className="text-red-600 font-black">Scanner POS</span>
        </h1>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Hệ thống nhận diện soát vé tự động</p>
      </div>

      <div className="max-w-md w-full bg-zinc-950/60 border border-zinc-900 rounded-[2.5rem] p-6 backdrop-blur-xl shadow-2xl relative z-10">
        
        {scannerEnabled && (
          <div className="flex flex-col items-center relative">
            <div className="w-full relative overflow-hidden rounded-3xl border border-zinc-800 bg-black shadow-inner group aspect-square">
              <div 
                id="reader" 
                className={`w-full h-full transition-transform duration-300 ${isMirrored ? 'scale-x-[-1]' : 'scale-x-1'}`}
              />
              <div className="absolute inset-0 pointer-events-none border-[16px] border-black/40 flex items-center justify-center">
                <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-red-600 rounded-tl-md" />
                <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-red-600 rounded-tr-md" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-red-600 rounded-bl-md" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-red-600 rounded-br-md" />
                <div className="w-[85%] h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-0 animate-[bounce_2s_infinite] shadow-[0_0_12px_#dc2626]" />
              </div>
            </div>

            <div className="w-full flex justify-between items-center mt-4 px-1">
              <p className="text-[9px] uppercase font-black tracking-widest text-zinc-500 italic">
                Dí sát mã QR vào tâm khung quét
              </p>
              <button 
                onClick={() => setIsMirrored(!isMirrored)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-[9px] font-black uppercase tracking-wider"
              >
                <FlipHorizontal size={12} />
                <span>{isMirrored ? "Tắt đảo kính" : "Lật đảo kính"}</span>
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 border-4 border-red-600/20 rounded-full" />
              <Loader2 className="animate-spin text-red-600 relative z-10" size={40} strokeWidth={3} />
            </div>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-red-500 animate-pulse">Đang liên lạc máy chủ...</span>
          </div>
        )}

        {error && !loading && (
          <div className="py-6 flex flex-col items-center text-center">
            <div className="p-4 bg-red-600/10 border border-red-600/20 text-red-500 rounded-2xl mb-4 shadow-inner">
              <AlertTriangle size={36} />
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider mb-1.5">Mã Vé Không Hợp Lệ</h2>
            <p className="text-zinc-500 text-[11px] px-6 mb-6 font-medium leading-relaxed">{error}</p>
            <button 
              onClick={handleResetScanner}
              className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={12} /> Thử quét lại mã khác
            </button>
          </div>
        )}

        {orderData && !loading && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
            
            <div className="flex items-center gap-3 p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-emerald-400 shadow-md shadow-emerald-950/20">
              <CheckCircle2 size={20} className="shrink-0" />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Xác thực thành công</h4>
                <p className="text-[9px] text-emerald-500/70 font-black uppercase leading-none">Trạng thái đơn: {orderData.status}</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 relative overflow-hidden space-y-3.5">
              <div className="absolute top-0 bottom-0 left-[-6px] w-3 flex flex-col justify-between my-2 pointer-events-none">
                {[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#060608] rounded-full border-r border-zinc-900" />)}
              </div>
              
              <div className="flex justify-between items-center text-[10px] pl-3">
                <span className="text-zinc-500 font-black uppercase tracking-wider">Hóa đơn điện tử</span>
                <span className="font-black text-red-500 tracking-wide">#{orderData.id}</span>
              </div>

              {orderData.cinemaName && (
                <div className="flex items-start gap-2 text-[10px] pl-3 border-t border-zinc-900/60 pt-3">
                  <MapPin size={13} className="text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 font-black uppercase tracking-wider leading-none mb-1">Địa điểm xem phim</p>
                    <p className="font-bold text-white leading-tight">{orderData.cinemaName}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-[10px] pl-3 border-t border-zinc-900/60 pt-3">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Calendar size={12} />
                  <span className="font-black uppercase tracking-wider">Hình thức</span>
                </div>
                <span className="font-black text-zinc-300 uppercase italic bg-zinc-900 px-2 py-0.5 border border-zinc-800 rounded">
                  {orderData.paymentMethod}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] uppercase font-black tracking-widest text-zinc-500 pl-1">Vật phẩm cần bàn giao:</p>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                {orderData.orderDetails?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl transition-all hover:bg-zinc-900/70">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${
                        item.itemType === 'TICKET' 
                          ? 'bg-amber-500/5 text-amber-500 border-amber-500/10' 
                          : 'bg-pink-500/5 text-pink-500 border-pink-500/10'
                      }`}>
                        {item.itemType === 'TICKET' ? <Armchair size={15} /> : <Coffee size={15} />}
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-white uppercase tracking-wide">
                          {item.itemType === 'TICKET' ? 'Vé vào phòng chiếu' : 'Combo Bắp Nước'}
                        </p>
                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider mt-0.5">Mã vật phẩm: #{item.itemId}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-red-600/10 border border-red-600/20 text-red-500 rounded-lg text-xs font-black italic">
                      x{item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-zinc-950 to-zinc-900 rounded-2xl flex justify-between items-center border border-zinc-900">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Tổng doanh thu hóa đơn</span>
              <span className="text-lg font-[1000] text-white italic tracking-tight bg-clip-text">
                {orderData.totalAmount?.toLocaleString()}đ
              </span>
            </div>

            <button 
              onClick={handleConfirmCheckIn}
              disabled={confirmLoading}
              className="w-full h-13 bg-white text-black hover:bg-red-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/50 active:scale-[0.98] disabled:opacity-50"
            >
              {confirmLoading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Ticket size={14} strokeWidth={3} />
              )}
              <span>{confirmLoading ? "Đang khóa mã vé..." : "Bàn giao xong & Xác nhận"}</span>
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        #reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important; 
          border-radius: 1.5rem !important;
        }
        #reader {
          border: none !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}