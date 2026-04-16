"use client";

import React, { useState, useEffect } from 'react';
import { 
  Loader2, Monitor, Armchair, Trash2, 
  Building2, AlertTriangle, Settings2, ChevronRight 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { apiRequest } from '@/app/lib/api';
import FormPhongChieu from './RoomForm';

export default function QuanLyPhongCompact() {
  const router = useRouter();
  
  const [cinemaId, setCinemaId] = useState<number | null>(null);
  const [cinemaName, setCinemaName] = useState<string>("");
  const [phongChieu, setPhongChieu] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  
  const [hienModal, setHienModal] = useState(false);
  const [dangSuaId, setDangSuaId] = useState<number | null>(null);
  const [duLieuForm, setDuLieuForm] = useState({ name: '', totalSeats: 0, cinemaItemId: 0 });
  const [phongDangChonXoa, setPhongDangChonXoa] = useState<{id: number, name: string} | null>(null);

  useEffect(() => {
    const khoiTaoHeThong = async () => {
      try {
        setDangTai(true);
        
        // 1. Gọi API lấy thông tin chính mình (khớp với Swagger: GET /api/v1/users/me)
        const resUser = await apiRequest('/api/v1/users/me'); 
        if (!resUser.ok) throw new Error("Unauthorized");
        
        const userRes = await resUser.json();
        // Lấy managedCinemaItemId từ object data trả về
        const idRap = userRes.data?.managedCinemaItemId;

        if (idRap) {
          setCinemaId(idRap);
          setDuLieuForm(prev => ({ ...prev, cinemaItemId: idRap }));

          // 2. Gọi song song lấy chi tiết rạp và danh sách phòng
          const [resCinema, resRooms] = await Promise.all([
            apiRequest(`/api/v1/cinema-items/${idRap}`),
            apiRequest(`/api/v1/rooms/cinema-item/${idRap}`)
          ]);

          const dataCinema = await resCinema.json();
          const dataRooms = await resRooms.json();

          // Dùng address làm tên hiển thị (khớp với DB của bạn)
          setCinemaName(dataCinema.data?.address || dataCinema.data?.name || `Cơ sở ${idRap}`);
          setPhongChieu(dataRooms.data || []);
        } else {
          toast.error("Tài khoản chưa được phân quyền quản lý rạp!");
        }
      } catch (err) {
        toast.error("Phiên đăng nhập hết hạn!");
        router.push('/login');
      } finally {
        setDangTai(false);
      }
    };

    khoiTaoHeThong();
  }, [router]);

  const taiLaiDanhSach = async () => {
    if (!cinemaId) return;
    const res = await apiRequest(`/api/v1/rooms/cinema-item/${cinemaId}`);
    const ketQua = await res.json();
    setPhongChieu(ketQua.data || []);
  };

  const xuLyLuu = async (e: React.FormEvent) => {
    e.preventDefault();
    const dangSua = !!dangSuaId;
    const url = dangSua ? `/api/v1/rooms/${dangSuaId}` : '/api/v1/rooms';
    const thongBaoCho = toast.loading("Đang xử lý...");
    
    try {
      const res = await apiRequest(url, { 
        method: dangSua ? 'PUT' : 'POST', 
        body: JSON.stringify({ ...duLieuForm, cinemaItemId: cinemaId }) 
      });
      
      if (res.ok) {
        toast.success(dangSua ? "Đã cập nhật!" : "Đã thêm phòng!", { id: thongBaoCho });
        setHienModal(false);
        taiLaiDanhSach();
      } else {
        toast.error("Thao tác thất bại!", { id: thongBaoCho });
      }
    } catch (err) { toast.error("Lỗi hệ thống!", { id: thongBaoCho }); }
  };

  const xacNhanXoaPhong = async () => {
    if (!phongDangChonXoa) return;
    const thongBaoCho = toast.loading("Đang xóa...");
    try {
      const res = await apiRequest(`/api/v1/rooms/${phongDangChonXoa.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Đã xóa thành công!", { id: thongBaoCho });
        setPhongDangChonXoa(null);
        taiLaiDanhSach();
      } else {
        toast.error("Phòng đang có lịch chiếu!", { id: thongBaoCho });
      }
    } catch (err) { toast.error("Lỗi xóa phòng!", { id: thongBaoCho }); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 p-6 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-wrap justify-between items-end mb-16 gap-6">
          <div className="flex items-center gap-5">
            <div className="p-5 bg-zinc-900 rounded-3xl text-red-600 border border-white/5 shadow-2xl">
              <Building2 size={32}/>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-[1000] uppercase italic text-white tracking-tighter leading-none">
                {dangTai ? "LOADING..." : (
                  <>
                    RẠP <span className="text-red-600">{cinemaName}</span>
                  </>
                )}
              </h1>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mt-3">Hệ thống quản lý phòng chiếu</p>
            </div>
          </div>
          
          {!dangTai && cinemaId && (
            <button 
              onClick={() => { setDangSuaId(null); setDuLieuForm({name:'', totalSeats:0, cinemaItemId: cinemaId}); setHienModal(true); }} 
              className="px-10 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-all active:scale-95"
            >
              + Thêm phòng
            </button>
          )}
        </header>

        {dangTai ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-40">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <span className="text-[10px] font-black uppercase tracking-widest">Đang tải dữ liệu từ server...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {phongChieu.length > 0 ? phongChieu.map((phong) => (
              <div 
                key={phong.id} 
                onClick={() => router.push(`/admin/rooms/${phong.id}`)} 
                className="group relative bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 hover:border-red-600/30 transition-all cursor-pointer shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <ChevronRight className="text-red-600" size={24} />
                </div>

                <div className="flex justify-between items-start mb-14">
                  <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <Monitor size={28} className="text-white" />
                  </div>
                  <div className="flex gap-2 relative z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDangSuaId(phong.id); setDuLieuForm({name: phong.name, totalSeats: phong.totalSeats, cinemaItemId: cinemaId!}); setHienModal(true); }} 
                      className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl"
                    >
                      <Settings2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPhongDangChonXoa({ id: phong.id, name: phong.name }); }} 
                      className="p-3 bg-white/5 hover:bg-red-600 hover:text-white rounded-xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-black uppercase italic text-zinc-200 group-hover:text-white mb-6">
                  {phong.name}
                </h3>
                
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Armchair size={16} className="text-zinc-700" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{phong.totalSeats} Ghế</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-zinc-800 tracking-widest group-hover:text-red-800">Chi tiết</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-800">Cơ sở hiện chưa có phòng chiếu</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal xác nhận xóa */}
      {phongDangChonXoa && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setPhongDangChonXoa(null)}></div>
          <div className="relative bg-[#0d0d0f] border border-white/10 rounded-[3.5rem] p-12 w-full max-w-sm text-center">
            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center text-red-600 mx-auto mb-8">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-black uppercase italic text-white mb-3">Xác nhận xóa?</h2>
            <p className="text-zinc-500 text-xs font-bold mb-10 uppercase tracking-widest leading-relaxed">
              Dữ liệu của phòng <br/><span className="text-white">"{phongDangChonXoa.name}"</span> <br/> sẽ bị xóa khỏi hệ thống.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setPhongDangChonXoa(null)} className="flex-1 py-5 bg-zinc-900 text-zinc-600 rounded-2xl font-black uppercase text-[10px] hover:text-white">Hủy</button>
              <button onClick={xacNhanXoaPhong} className="flex-1 py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] hover:bg-red-700">Xóa ngay</button>
            </div>
          </div>
        </div>
      )}

      {hienModal && (
        <FormPhongChieu 
          dangSuaId={dangSuaId} 
          duLieuForm={duLieuForm} 
          setDuLieuForm={setDuLieuForm} 
          onSubmit={xuLyLuu} 
          onDong={() => setHienModal(false)}
        />
      )}
    </div>
  );
}