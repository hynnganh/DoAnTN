"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, XCircle, Home, ArrowRight, Ticket, Calendar, Clapperboard
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Particle {
  id: number;
  width: string;
  height: string;
  top: string;
  left: string;
  duration: string;
  delay: string;
}

export default function PaymentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [count, setCount] = useState(5);
  const [particles, setParticles] = useState<Particle[]>([]);

  const responseCode = searchParams.get('vnp_ResponseCode');
  const isSuccess = responseCode === '00';
  
  const amount = Number(searchParams.get('vnp_Amount') || 0) / 100;
  const txnRef = searchParams.get('vnp_TxnRef') || 'N/A';

  // 1. Effect khởi tạo giao diện và thông báo (Chạy 1 lần duy nhất khi mount)
  useEffect(() => {
    const generatedParticles = [...Array(12)].map((_, i) => ({
      id: i,
      width: Math.random() * 3 + 1 + 'px',
      height: Math.random() * 3 + 1 + 'px',
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      duration: Math.random() * 4 + 4 + 's',
      delay: Math.random() * 2 + 's'
    }));
    setParticles(generatedParticles);

    if (isSuccess) {
      toast.success("Thanh toán thành công!", { icon: '🎉', duration: 4000 });
    } else if (responseCode) {
      toast.error("Giao dịch không thành công");
    }
  }, [isSuccess, responseCode]);

  // 2. EFFECT SỬA LỖI: Xử lý đếm ngược và chuyển trang chuẩn React Lifecycle
  useEffect(() => {
    // Nếu thanh toán thất bại thì không cần đếm ngược tự động chuyển trang
    if (!isSuccess) return;

    // Khi bộ đếm chạm mốc 0, thực hiện chuyển hướng an toàn ngoài luồng render state
    if (count === 0) {
      router.push('/');
      return;
    }

    // Thiết lập bộ đếm lùi bằng setTimeout chạy chuỗi liên hoàn
    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, isSuccess, router]);

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Background Glows mềm mại */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-red-600/10 blur-[130px] rounded-full animate-pulse-slow" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full animate-pulse-slow delay-1000" />
      </div>

      {/* Main Compact Card */}
      <main className="relative z-10 w-full max-w-[380px] bg-zinc-900/40 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden scale-in-smooth">
        
        {isSuccess ? (
          <div>
            {/* Header Vé */}
            <div className="p-8 pb-6 text-center space-y-4 relative">
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping-slow" />
                <div className="relative bg-zinc-950 border-2 border-green-500 rounded-full w-full h-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                  <CheckCircle2 size={38} className="text-green-500 animate-bounce-short" />
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-3xl font-[1000] italic uppercase tracking-tighter leading-none">
                  Vé Đã <span className="text-green-500">Sẵn Sàng!</span>
                </h1>
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.25em]">
                  Hệ thống giao dịch A&K Cinema
                </p>
              </div>
            </div>

            {/* Đường cắt vé rạp phim */}
            <div className="relative w-full h-4 flex items-center justify-between px-0 my-2">
              <div className="w-4 h-8 bg-[#030303] rounded-full -ml-2 border-r border-white/10" />
              <div className="w-full h-[1px] border-t border-dashed border-white/20" />
              <div className="w-4 h-8 bg-[#030303] rounded-full -mr-2 border-l border-white/10" />
            </div>

            {/* Body Vé */}
            <div className="p-8 pt-4 space-y-6">
              <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-3.5 text-xs text-zinc-400">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-zinc-500"><Ticket size={13} className="text-red-500"/> Mã đơn hàng</span>
                  <span className="font-black text-white text-sm tracking-wide">#{txnRef}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-zinc-500"><Clapperboard size={13} className="text-red-500"/> Trạng thái</span>
                  <span className="font-black text-green-500 uppercase text-[10px] bg-green-500/5 border border-green-500/20 px-2.5 py-0.5 rounded-full">Đã thanh toán</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="font-bold uppercase text-[10px] text-zinc-500">Số tiền thanh toán</span>
                  <span className="text-xl font-[1000] italic text-red-500 tracking-tighter">{amount.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {/* Thanh loading bar đếm ngược */}
              <div className="space-y-2 text-center">
                <div className="w-full h-[3px] bg-zinc-800 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full bg-red-600 rounded-full animate-countdown-bar" />
                </div>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                  Tự động chuyển trang sau <span className="text-zinc-400">{count}s</span>
                </p>
              </div>

              <button 
                onClick={() => router.push('/')}
                className="group w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all duration-500 active:scale-95 shadow-xl"
              >
                Về trang chủ ngay <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300"/>
              </button>
            </div>
          </div>
        ) : (
          /* Giao diện Thất bại */
          <div className="p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-red-600/10 rounded-full animate-ping" />
              <div className="bg-zinc-950 border-2 border-red-600 rounded-full w-full h-full flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.3)]">
                <XCircle size={40} className="text-red-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-[1000] italic uppercase tracking-tighter">
                Giao Dịch <span className="text-red-600">Thất Bại</span>
              </h1>
              <p className="text-zinc-500 text-xs font-medium px-4 leading-relaxed">
                Đã xảy ra sự cố hoặc ông đã hủy quy trình thanh toán trên ví.
              </p>
            </div>

            <button 
              onClick={() => router.push('/')}
              className="w-full py-4 bg-zinc-800/80 border border-white/5 text-white rounded-2xl font-black uppercase text-xs hover:bg-white hover:text-black transition-all duration-300"
            >
              Quay lại trang chủ
            </button>
          </div>
        )}
      </main>

      {/* Cinematic Float Particles */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        {particles.map((p) => (
          <div 
            key={p.id}
            className="absolute bg-white rounded-full animate-float-glow"
            style={{
              width: p.width,
              height: p.height,
              top: p.top,
              left: p.left,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes countdown {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes floatGlow {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-25px) scale(1.3); opacity: 0.7; }
        }
        .scale-in-smooth {
          animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-countdown-bar {
          animation: countdown 5s linear forwards;
        }
        .animate-float-glow {
          animation: floatGlow infinite ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse infinite ease-in-out 4s;
        }
        .animate-ping-slow {
          animation: ping infinite cubic-bezier(0, 0, 0.2, 1) 2.5s;
        }
        .animate-bounce-short {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}