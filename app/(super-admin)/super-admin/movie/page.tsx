"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit3, Trash2, Film, Loader2, Search, Clapperboard } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { apiRequest } from '@/app/lib/api';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State phân trang
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 1. Hàm fetch dữ liệu - Đã dùng apiRequest
  const fetchMovies = async (search = "", pageNum = 0) => {
    setLoading(true);
    try {
      const url = `/api/v1/movies?search=${encodeURIComponent(search)}&page=${pageNum}&size=10`;
      const response = await apiRequest(url);
      const result = await response.json();
      
      if (response.ok) {
        setMovies(result.data.content || []);
        setTotalPages(result.data.totalPages);
      } else {
        toast.error(result.message || "Không thể tải danh sách phim!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối Server!");
    } finally {
      setLoading(false);
    }
  };

  // 2. Debounce Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0);
      fetchMovies(searchTerm, 0);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Fetch lại khi đổi trang
  useEffect(() => {
    if (searchTerm === "") {
        fetchMovies("", page);
    }
  }, [page]);

  // 3. Xóa phim - Đã dùng apiRequest
  const handleDelete = async (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="text-[10px] font-black uppercase text-white tracking-widest">Xác nhận xóa phim?</p>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await apiRequest(`/api/v1/movies/${id}`, {
                  method: 'DELETE'
                });
                if (res.ok) {
                  toast.success("Đã xóa phim thành công!");
                  fetchMovies(searchTerm, page);
                } else {
                  const errData = await res.json();
                  toast.error(errData.message || "Xóa thất bại!");
                }
              } catch (error) {
                toast.error("Lỗi kết nối khi xóa!");
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all hover:bg-red-700"
          >Xóa ngay</button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-white/10 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase hover:bg-white/20">Hủy</button>
        </div>
      </div>
    ), { style: { background: '#0c0c0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' } });
  };

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
      <Toaster position="top-right" /> 

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter text-white">
            Kho <span className="text-red-600">Phim</span>
          </h1>
          <div className="relative mt-6 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" size={16} />
            <input 
              type="text"
              value={searchTerm}
              placeholder="Tìm tên phim..."
              className="bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs text-white focus:outline-none focus:border-red-500/50 w-80 transition-all focus:bg-zinc-900 focus:shadow-[0_0_20px_rgba(220,38,38,0.1)]"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Link href="/super-admin/movie/create" className="bg-red-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95">
          <Plus size={16} /> Thêm phim mới
        </Link>
      </div>

      <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl min-h-[500px] backdrop-blur-sm">
        {loading ? (
          <div className="h-[500px] flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <Loader2 className="animate-spin text-red-600" size={48} />
                <Clapperboard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" size={20} />
            </div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] animate-pulse">Đang đồng bộ dữ liệu...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="h-[500px] flex flex-col items-center justify-center text-zinc-600 italic">
            <Film size={48} className="mb-4 opacity-20" />
            <p className="text-xs uppercase font-black tracking-widest">Không tìm thấy bộ phim nào</p>
          </div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">
                <tr>
                  <th className="px-10 py-6">Thông tin phim</th>
                  <th className="px-10 py-6">Thể loại</th>
                  <th className="px-10 py-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {movies.map((movie: any) => (
                  <tr key={movie.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                    <td className="px-10 py-8">
  <div className="flex items-center gap-6">
    {/* Bọc Link quanh Poster và Nội dung */}
    <Link 
      href={`/super-admin/movie/${movie.id}`} 
      className="flex items-center gap-6 group/item"
    >
      <div className="w-14 h-20 bg-zinc-800 rounded-xl flex items-center justify-center text-red-600 border border-white/5 group-hover:border-red-600/50 transition-all group-hover:scale-105 shadow-lg overflow-hidden relative">
        {movie.posterUrl ? (
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
          />
        ) : <Film size={24}/>}
      </div>
      
      <div>
        <p className="text-white font-[1000] text-lg uppercase italic tracking-tighter group-hover:text-red-500 transition-colors">
          {movie.title}
        </p>
        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
          {movie.duration} phút • {movie.genreName || "Phim"}
        </p>
      </div>
    </Link>
  </div>
</td>
                    <td className="px-10 py-8 text-xs font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-200 transition-colors">
                        {movie.genreName || "Chưa cập nhật"} 
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-all transform group-hover:translate-x-[-10px]">
                        <Link href={`/super-admin/movie/edit/${movie.id}`} className="p-4 bg-white/5 rounded-2xl text-zinc-400 hover:text-white hover:bg-red-600 transition-all shadow-xl">
                            <Edit3 size={18}/>
                        </Link>
                        <button onClick={() => handleDelete(movie.id)} className="p-4 bg-white/5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shadow-xl">
                            <Trash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-10 border-t border-white/5 flex items-center justify-between">
              <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Hiển thị trang {page + 1} trên {totalPages}</p>
              <div className="flex gap-2">
                <button 
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="px-6 py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase text-zinc-500 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all border border-white/5"
                >Trước</button>
                <button 
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="px-6 py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase text-zinc-500 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all border border-white/5"
                >Sau</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}