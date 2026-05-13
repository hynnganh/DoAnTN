"use client";
import React, { useState, useEffect } from 'react';
import { X, Star, Send, Loader2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiRequest } from "@/app/lib/api"; 

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
  movieId: string | number;
}

export default function ReviewModal({ isOpen, onClose, movieTitle, movieId }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
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
    if (rating === 0) return toast.error("Vui lòng chọn số sao nhé!");
    const cleanComment = comment.trim();
    if (cleanComment.length < 10) return toast.error("Cảm nhận phải tối thiểu 10 ký tự!");

    setIsSubmitting(true);
    try {
      const response = await apiRequest("/api/v1/reviews", {
        method: "POST",
        body: JSON.stringify({
          movieId: Number(movieId),
          rating: rating,
          comment: cleanComment
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Gửi đánh giá thành công!");
        onClose();
        // Load lại trang để cập nhật điểm Rating và danh sách Review
        window.location.reload(); 
      } else {
        // Backend trả về: "Chưa mua vé", "Chưa xem xong", "Đã đánh giá rồi"...
        toast.error(result.message || "Gửi đánh giá thất bại!");
      }
    } catch (error) {
      toast.error("Lỗi máy chủ, kiểm tra lại Backend nhé!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60 animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-all hover:rotate-90"><X size={24}/></button>
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 italic">Verified Review</h3>
            <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter text-white leading-tight">{movieTitle}</h2>
          </div>

          <div className="flex flex-col items-center gap-2 py-6 bg-white/5 rounded-[2rem] border border-white/5">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={32} fill={(hover || rating) >= s ? "#dc2626" : "none"}
                  className={`cursor-pointer transition-all duration-300 ${(hover || rating) >= s ? "text-red-600 scale-110" : "text-zinc-800 hover:text-zinc-600"}`}
                  onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Phim có gì ấn tượng..."
              className="w-full h-32 bg-zinc-900 border border-white/5 rounded-[2rem] p-6 text-sm text-white focus:outline-none focus:border-red-600/50 resize-none italic font-medium placeholder:text-zinc-700" />
          </div>

          <button onClick={handleSubmit} disabled={isSubmitting || rating === 0 || comment.length < 10}
            className="w-full py-5 bg-red-600 text-white rounded-[1.5rem] text-[10px] font-[1000] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 disabled:opacity-30">
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <span>Gửi đánh giá ngay</span>}
          </button>
        </div>
      </div>
    </div>
  );
}