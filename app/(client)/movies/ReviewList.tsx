"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Star, Filter, Calendar, Loader2, User } from 'lucide-react';
import { apiRequest } from "@/app/lib/api";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function ReviewList({ movieId }: { movieId: string | number }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number>(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiRequest(`/api/v1/reviews/movie/${movieId}`);
        const data = await response.json();
        // Kiểm tra nếu data là mảng, nếu không thì để mảng rỗng
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi lấy danh sách review:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (movieId) fetchReviews();
  }, [movieId]);

  const filteredReviews = useMemo(() => {
    if (filterRating === 0) return reviews;
    return reviews.filter(r => r.rating === filterRating);
  }, [reviews, filterRating]);

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-red-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <h3 className="text-red-600 font-black uppercase tracking-[0.4em] italic text-[10px]">Audience Voices</h3>
          <h2 className="text-4xl font-[1000] italic text-white uppercase tracking-tighter">Đánh giá từ người xem</h2>
        </div>
        
        <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
          {[0, 5, 4, 3, 2, 1].map((star) => (
            <button key={star} onClick={() => setFilterRating(star)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                filterRating === star ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-white'
              }`}>
              {star === 0 ? "Tất cả" : `${star} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Danh sách */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] hover:border-red-600/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white border border-white/10 group-hover:border-red-600/50 transition-colors">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-wider">{review.user?.name || "Khán giả"}</p>
                    <p className="text-zinc-600 text-[10px] font-bold flex items-center gap-1 uppercase">
                      <Calendar size={12}/> {format(new Date(review.createdAt), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "#dc2626" : "none"} 
                      className={i < review.rating ? "text-red-600" : "text-zinc-800"} />
                  ))}
                </div>
              </div>
              <p className="text-zinc-400 text-sm italic leading-relaxed border-l-2 border-red-600/20 pl-4 group-hover:border-red-600 transition-colors">
                "{review.comment}"
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs italic">Chưa có đánh giá nào cho bộ phim này</p>
          </div>
        )}
      </div>
    </div>
  );
}