"use client";
import React from 'react';
import Link from 'next/link';
import { Plus, Edit3, Trash2, Film } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; // Đã thêm import này

export default function MoviesPage() {
  const movies = [
    { id: 1, title: 'Avatar: The Way of Water', duration: 192, status: 'Now Showing', director: 'James Cameron' },
    { id: 2, title: 'Dune: Part Two', duration: 166, status: 'Coming Soon', director: 'Denis Villeneuve' },
  ];

  const handleDelete = (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="text-[10px] font-black uppercase text-white tracking-widest">
          Xác nhận xóa phim này?
        </p>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              // Logic gọi API DELETE sẽ ở đây
              console.log("Đã xóa ID:", id);
              toast.dismiss(t.id);
              toast.success("Đã xóa phim thành công!");
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all"
          >
            Xóa ngay
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all"
          >
            Hủy
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#0c0c0c',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '16px',
        borderRadius: '20px'
      }
    });
  };

  return (
    <div className="space-y-10">
      {/* Component này giúp các thông báo "bật" ra được */}
      <Toaster /> 

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-white">Kho Phim</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-2">Tổng số: {movies.length} bộ phim</p>
        </div>
        <Link href="/admin/movies/create" className="bg-red-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
          <Plus size={16} /> Thêm phim mới
        </Link>
      </div>

      <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">
            <tr>
              <th className="px-10 py-6">Phim</th>
              <th className="px-10 py-6">Đạo diễn</th>
              <th className="px-10 py-6">Trạng thái</th>
              <th className="px-10 py-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {movies.map((movie) => (
              <tr key={movie.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-zinc-800 rounded-lg flex items-center justify-center text-red-600 border border-white/5">
                      <Film size={20}/>
                    </div>
                    <p className="text-white font-black uppercase italic tracking-tighter group-hover:text-red-500 transition-colors">
                      {movie.title}
                    </p>
                  </div>
                </td>
                <td className="px-10 py-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  {movie.director}
                </td>
                <td className="px-10 py-8">
                  <span className="text-[9px] font-black uppercase px-3 py-1 border border-white/10 rounded-full text-zinc-500 group-hover:border-zinc-700 transition-colors">
                    {movie.status}
                  </span>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={`/admin/movies/edit/${movie.id}`} 
                      className="p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Edit3 size={16}/>
                    </Link>
                    <button 
                      onClick={() => handleDelete(movie.id)} // Đã gắn hàm xóa vào đây
                      className="p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}