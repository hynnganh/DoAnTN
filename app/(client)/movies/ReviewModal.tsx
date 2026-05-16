"use client";
import React, { useState, useEffect } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { apiRequest } from "@/app/lib/api"; 

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
  movieId: string | number;
}

export default function ReviewModal({ isOpen, onClose, movieTitle, movieId }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setComment("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // KÍCH HOẠT RÀNG BUỘC KHI NGƯỜI DÙNG CLICK NÚT GỬI
    if (rating === 0) {
      return toast.error("Vui lòng chọn số sao đánh giá nhé!");
    }
    
    const cleanComment = comment.trim();
    if (cleanComment.length < 10) {
      return toast.error("Nội dung cảm nhận phải tối thiểu 10 ký tự!");
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest("/api/v1/reviews", {
        method: "POST",
        body: JSON.stringify({
          movieId: Number(movieId),
          rating: rating, // Gửi số thực thập phân lên Backend (ví dụ: 4.5)
          comment: cleanComment
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Gửi đánh giá thành công!");
        onClose();
        window.location.reload(); 
      } else {
        toast.error(result.message || "Gửi đánh giá thất bại!");
      }
    } catch (error) {
      toast.error("Lỗi máy chủ, kiểm tra lại Backend nhé!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tính toán số sao hiện tại khi rê chuột hoặc đã click chọn
  const currentRatingValue = hover || rating;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60 animate-in fade-in duration-300">
      
      {/* CẤU HÌNH THÔNG BÁO Ở CHÍNH GIỮA MÀN HÌNH + ANIMATION ĐẸP MẮT */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        containerStyle={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // Căn giữa tuyệt đối màn hình
          zIndex: 99999,
        }}
        toastOptions={{
          className: 'scale-in-toast',
          style: {
            background: '#0c0c0e',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1.5rem',
            padding: '16px 28px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.02em',
          },
          success: {
            iconTheme: {
              primary: '#dc2626', // Trả về màu đỏ nguyên bản hệ thống của ông
              secondary: '#000',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626', // Màu đỏ cảnh báo lỗi
              secondary: '#000',
            },
          }
        }}
      />
      
      {/* Định nghĩa SVG mã màu Gradient cho nửa ngôi sao màu VÀNG ÁNH KIM (#f59e0b) */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="half-star-gradient">
            <stop offset="50%" stopColor="#f59e0b" /> 
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-all hover:rotate-90"><X size={24}/></button>
        
        <div className="space-y-6">
          <div className="text-center space-y-2">
            {/* KHÔI PHỤC: Màu đỏ gốc text-red-600 */}
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 italic">Verified Review</h3>
            <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter text-white leading-tight">{movieTitle}</h2>
          </div>

          {/* KHU VỰC ĐÁNH GIÁ NGÔI SAO VÀNG */}
          <div className="flex flex-col items-center gap-2 py-6 bg-white/5 rounded-[2rem] border border-white/5 select-none">
            <div className="flex gap-1 relative">
              {[1, 2, 3, 4, 5].map((s) => {
                const activeValue = hover || rating;
                
                let fillStyle = "none";
                let strokeColor = "text-zinc-800";

                if (activeValue >= s) {
                  fillStyle = "#f59e0b"; // Đổ đặc màu vàng kim
                  strokeColor = "text-amber-500 scale-110 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]";
                } else if (activeValue === s - 0.5) {
                  fillStyle = "url(#half-star-gradient)"; // Đổ nửa màu vàng kim
                  strokeColor = "text-amber-500 scale-110 drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]";
                }

                return (
                  <div key={s} className="relative w-9 h-9 flex items-center justify-center">
                    <Star size={32} fill={fillStyle} className={`transition-all duration-300 ${strokeColor}`} />
                    
                    {/* Vùng click cảm ứng bên TRÁI (.5 sao) */}
                    <div 
                      className="absolute left-0 top-0 w-1/2 h-full cursor-pointer z-10"
                      onMouseEnter={() => setHover(s - 0.5)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(s - 0.5)}
                    />
                    
                    {/* Vùng click cảm ứng bên PHẢI (1 sao) */}
                    <div 
                      className="absolute right-0 top-0 w-1/2 h-full cursor-pointer z-10"
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(s)}
                    />
                  </div>
                );
              })}
            </div>

            {/* ĐÃ CẬP NHẬT DỮ LIỆU ĐỘNG THEO YÊU CẦU: Không có điểm thì hiện CHƯA CÓ ĐÁNH GIÁ */}
            <span className="text-xs font-black text-zinc-500 mt-2 uppercase tracking-wide">
              {currentRatingValue > 0 ? `${currentRatingValue.toFixed(1)} / 5.0 Sao` : "CHƯA CÓ ĐÁNH GIÁ"}
            </span>
          </div>

          <div className="space-y-3">
            {/* KHÔI PHỤC: border màu đỏ gốc focus:border-red-600/50 */}
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Phim có gì ấn tượng với bạn..."
              className="w-full h-32 bg-zinc-900 border border-white/5 rounded-[2rem] p-6 text-sm text-white focus:outline-none focus:border-red-600/50 resize-none italic font-medium placeholder:text-zinc-700" />
          </div>

          {/* Giữ nguyên nút gửi màu đỏ gốc */}
          <button onClick={handleSubmit} disabled={isSubmitting}
            className="w-full py-5 bg-red-600 text-white rounded-[1.5rem] text-[10px] font-[1000] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 disabled:opacity-30">
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <span>Gửi đánh giá ngay</span>}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes toastScaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        .scale-in-toast {
          animation: toastScaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
}