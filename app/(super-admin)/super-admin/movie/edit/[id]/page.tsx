"use client";
import React, { useEffect, useState, use } from 'react';
import MovieForm from "../../MovieForm";
import { apiRequest } from '@/app/lib/api';
import { Loader2, ShieldAlert } from 'lucide-react';
import Cookies from 'js-cookie';

export default function EditMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Ép token vào để lấy dữ liệu ban đầu không bị 403
        const token = localStorage.getItem("token") || Cookies.get("token");
        const res = await apiRequest(`/api/v1/movies/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const resData = await res.json();
          // Backend trả về { data: { ... } }
          setMovie(resData.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Lỗi Fetch:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovie();
  }, [id]);

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-zinc-500">
      <Loader2 className="animate-spin text-red-600" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Đang đồng bộ dữ liệu...</p>
    </div>
  );

  if (error || !movie) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-zinc-500 gap-4">
      <ShieldAlert size={40} className="text-red-600" />
      <p className="font-black uppercase italic text-white tracking-tighter">Lỗi xác thực (403/404)</p>
      <p className="text-[9px]">ID phim {id} không tồn tại hoặc Token Super Admin hết hạn.</p>
    </div>
  );

  return <MovieForm type="edit" initialData={movie} />;
}