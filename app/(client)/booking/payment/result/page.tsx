"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, XCircle, Home, ArrowRight, Loader2 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PaymentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [count, setCount] = useState(5);

  const responseCode = searchParams.get('vnp_ResponseCode');
  const isSuccess = responseCode === '00';

  useEffect(() => {
    if (isSuccess) {
      toast.success("Thanh toán thành công!", { icon: '🎉', duration: 4000 });
      
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSuccess, router]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <Toaster position="top-center" />

      {/* Hiệu ứng nền Cinematic Blur */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-600/20 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-md w-full">
        {isSuccess ? (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
            {/* Success Icon với hiệu ứng Ping */}
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
              <div className="relative bg-zinc-900 border-4 border-green-500 rounded-full w-full h-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                <CheckCircle2 size={64} className="text-green-500" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter">
                Giao dịch <span className="text-green-500">Thành công!</span>
              </h1>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                Hệ thống A&K Cinema đã ghi nhận vé của bạn
              </p>
            </div>

            {/* Thẻ thông báo đếm ngược */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Quay về trang chủ sau</p>
               <p className="text-4xl font-[1000] italic text-red-600 tracking-tighter">{count}s</p>
            </div>

            <button 
              onClick={() => router.push('/')}
              className="group w-full py-6 bg-white text-black rounded-full font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all duration-500 shadow-2xl active:scale-95"
            >
              <Home size={18}/> Về trang chủ ngay <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        ) : (
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-top-10 duration-500">
            <div className="bg-zinc-900 border-4 border-red-600 rounded-full w-32 h-32 mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.2)]">
              <XCircle size={64} className="text-red-600" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter">
                Giao dịch <span className="text-red-600">Thất bại</span>
              </h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest px-8">
                Đã có lỗi xảy ra hoặc giao dịch đã bị hủy từ phía cổng thanh toán.
              </p>
            </div>
            <button 
              onClick={() => router.push('/')}
              className="w-full py-5 bg-zinc-900 border border-white/10 rounded-full font-black uppercase text-xs hover:bg-white hover:text-black transition-all duration-300"
            >
              Quay lại trang chủ
            </button>
          </div>
        )}
      </main>

      {/* Floating Particles (Hiệu ứng hạt Cinematic) */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: (Math.random() * 3 + 2) + 's'
            }}
          />
        ))}
      </div>
    </div>
  );
}