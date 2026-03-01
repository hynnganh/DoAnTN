import React from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';

const PaymentView = ({ info, selectedSeats, totalPrice, paymentMethod, setPaymentMethod, onBack, onConfirm, loading }: any) => {
  return (
    <div className="relative z-10 bg-[#0a0a0a] w-full max-w-5xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[550px] animate-in fade-in zoom-in-95 duration-500">
      
      {/* Cột trái: Thông tin vé (Chi tiết hơn, sang trọng hơn) */}
      <div className="flex-[0.8] p-10 bg-gradient-to-br from-white/[0.03] to-transparent border-r border-dashed border-white/10 relative">
        <button 
          onClick={onBack} 
          disabled={loading}
          className="mb-10 flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-red-500 transition-all tracking-[0.2em] disabled:opacity-0 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> 
          Quay lại sơ đồ
        </button>
        
        <div className="space-y-8 text-white">
          <div className="flex items-center gap-4">
            <span className="bg-red-600 text-[10px] font-black px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.4)]">T18</span>
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{info.title}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest opacity-50">Lịch chiếu</p>
              <p className="text-base font-bold text-white/90">{info.time}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest opacity-50">Ghế đã chọn</p>
              <p className="text-2xl font-black text-red-600 tracking-tighter leading-tight italic">
                {selectedSeats.join(", ")}
              </p>
            </div>
          </div>

          <div className="pt-6">
            <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 shadow-inner relative overflow-hidden group">
              {/* Hiệu ứng nền nhẹ khi hover */}
              <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2">Tổng số tiền</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-5xl font-black text-white tracking-tighter italic">
                    {totalPrice.toLocaleString()}
                  </p>
                  <span className="text-lg font-black text-red-600 italic">VNĐ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: Phương thức & QR (Tối ưu phản hồi người dùng) */}
      <div className="flex-1 p-10 flex flex-col justify-center bg-[#0a0a0a] relative">
         <div className="grid grid-cols-3 gap-3 mb-10">
            {['momo', 'vnpay', 'card'].map(m => (
              <button 
                key={m} 
                disabled={loading}
                onClick={() => setPaymentMethod(m)} 
                className={`py-4 rounded-2xl border transition-all duration-300 text-[10px] font-black tracking-widest uppercase 
                  ${paymentMethod === m 
                    ? 'bg-red-600 border-red-600 text-white shadow-[0_10px_25px_rgba(220,38,38,0.3)] scale-105' 
                    : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:border-white/10'
                  } disabled:opacity-30 disabled:scale-100`}
              >
                {m}
              </button>
            ))}
         </div>

         <div className="bg-white/[0.01] border border-white/5 p-10 rounded-[3rem] text-center mb-10 relative overflow-hidden group">
            {/* Hiệu ứng quét sáng (Shimmer) */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-[shimmer_2.5s_infinite] pointer-events-none"></div>
            
            <div className="bg-white p-4 rounded-[2rem] inline-block mb-6 shadow-[0_0_50px_rgba(255,255,255,0.05)] relative z-10 animate-in zoom-in-90 duration-700">
              <div className="relative">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${paymentMethod}_${totalPrice}`} 
                  className={`w-40 h-40 transition-all duration-1000 ease-in-out ${loading ? 'blur-md opacity-20 scale-90' : 'blur-0 opacity-100 scale-100'}`} 
                  alt="QR Payment" 
                />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 animate-pulse"></div>
                      <Loader2 className="animate-spin text-black relative z-10" size={40} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Quét mã QR</p>
              <p className="text-[9px] font-bold text-gray-600 italic">Hỗ trợ tất cả ứng dụng ngân hàng</p>
            </div>
         </div>

         {/* Nút bấm Final */}
         <button 
           onClick={onConfirm} 
           disabled={loading} 
           className="group relative w-full py-6 rounded-full bg-red-600 text-white font-black uppercase text-[11px] tracking-[0.5em] shadow-[0_15px_30px_rgba(220,38,38,0.25)] active:scale-95 hover:bg-red-500 transition-all duration-300 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:shadow-none overflow-hidden"
         >
            <span className={`flex items-center justify-center gap-3 transition-transform duration-500 ${loading ? 'translate-y-10' : 'translate-y-0'}`}>
              Xác nhận thanh toán
            </span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center gap-3 animate-in slide-in-from-bottom-4">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-[10px]">Đang xử lý giao dịch...</span>
              </div>
            )}
         </button>
      </div>

      {/* Tailwind Custom Styles (Thêm vào global hoặc dùng style jsx) */}
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default PaymentView;