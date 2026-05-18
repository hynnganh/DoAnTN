"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Monitor, Armchair, Trash2, Building2, AlertTriangle, Settings2, ChevronRight, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiAdminRequest } from '@/app/lib/api';
import FormPhongChieu from './RoomForm';

export default function QuanLyPhongCompact() {
  const router = useRouter();
  const [cinemaId, setCinemaId] = useState<number | null>(null);
  const [cinemaName, setCinemaName] = useState<string>("");
  const [phongChieu, setPhongChieu] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [hienModal, setHienModal] = useState(false);
  const [dangSuaId, setDangSuaId] = useState<number | null>(null);
  const [duLieuForm, setDuLieuForm] = useState({ name: '', totalSeats: 0 });
  const [phongDangChonXoa, setPhongDangChonXoa] = useState<{id: number, name: string} | null>(null);

  // Hàm xử lý chuỗi JSON an toàn
  const safeParse = async (res: Response) => {
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  };

  const taiLaiDanhSach = async (targetId: number) => {
    try {
      const res = await apiAdminRequest(`/api/v1/rooms/cinema-item/${targetId}`);
      if (res.ok) {
        const ketQua = await safeParse(res);
        setPhongChieu(ketQua.data || []);
      }
    } catch (err) {
      console.error("Lỗi cập nhật danh sách phòng:", err);
    }
  };

  useEffect(() => {
    const khoiTao = async () => {
      try {
        setDangTai(true);
        const resUser = await apiAdminRequest('/api/v1/users/me'); 
        if (!resUser.ok) throw new Error();
        
        const userRes = await safeParse(resUser);
        const idRap = userRes.data?.managedCinemaItemId;

        if (idRap) {
          setCinemaId(idRap);
          const resCinema = await apiAdminRequest(`/api/v1/cinema-items/${idRap}`);
          const dataCinema = await safeParse(resCinema);
          setCinemaName(dataCinema.data?.name || `Cơ sở ${idRap}`);
          await taiLaiDanhSach(idRap);
        }
      } catch (err) {
        toast.error("Phiên đăng nhập hết hạn!");
        router.push('/login');
      } finally {
        setDangTai(false);
      }
    };
    khoiTao();
  }, [router]);

  const xuLyLuu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cinemaId) return;

    const dangSua = !!dangSuaId;
    const url = dangSua ? `/api/v1/rooms/${dangSuaId}` : '/api/v1/rooms';
    const thongBao = toast.loading("Đang xử lý dữ liệu...");
    
    try {
      const res = await apiAdminRequest(url, { 
        method: dangSua ? 'PUT' : 'POST', 
        body: JSON.stringify({ ...duLieuForm, cinemaItemId: cinemaId }) 
      });
      
      if (res.ok) {
        toast.success(dangSua ? "Cập nhật thành công!" : "Đã thêm phòng mới!", { id: thongBao });
        setHienModal(false);
        await taiLaiDanhSach(cinemaId); 
      } else {
        toast.error("Thao tác thất bại!", { id: thongBao });
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ!", { id: thongBao });
    }
  };

  const xacNhanXoa = async () => {
    if (!phongDangChonXoa || !cinemaId) return;

    const thongBao = toast.loading("Đang thực hiện xóa...");

    try {
      const res = await apiAdminRequest(
        `/api/v1/rooms/${phongDangChonXoa.id}`,
        { method: "DELETE" }
      );

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        toast.success(data.message || "Đã xóa phòng thành công!", { id: thongBao });
        setPhongDangChonXoa(null);
        await taiLaiDanhSach(cinemaId);
      } else {
        toast.error(
          data.message || data.error || "Phòng đang có suất chiếu chưa diễn ra!", 
          { id: thongBao }
        );
      }
    } catch (err) {
      toast.error("Không kết nối được máy chủ!", { id: thongBao });
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-zinc-400 p-6 font-sans select-none tracking-tight">
      <div className="max-w-6xl mx-auto">
        
        {/* THANH TIÊU ĐỀ CHÍNH */}
        <header className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-6 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-zinc-950 rounded-xl text-red-600 border border-zinc-900 shadow-sm">
              <Building2 size={24}/>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight leading-none">
                Rạp <span className="text-red-600">{cinemaName}</span>
              </h1>
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-wider mt-2">Hệ thống quản lý phòng chiếu nội bộ</p>
            </div>
          </div>
          
          {!dangTai && (
            <button 
              onClick={() => { setDangSuaId(null); setDuLieuForm({name:'', totalSeats:0}); setHienModal(true); }} 
              className="px-6 py-3 bg-white text-black rounded-xl font-black text-[11px] uppercase hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm"
            >
              + Thêm phòng chiếu
            </button>
          )}
        </header>

        {/* TRẠNG THÁI ĐANG TẢI */}
        {dangTai ? (
           <div className="flex flex-col items-center py-40 gap-3 opacity-40">
             <Loader2 className="animate-spin text-red-600" size={32} />
             <span className="text-[9px] font-black uppercase tracking-wider">Đang đồng bộ dữ liệu...</span>
           </div>
        ) : (
          /* DANH SÁCH LƯỚI PHÒNG CHIẾU */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {phongChieu.map((phong) => (
              <div 
                key={phong.id} 
                className="group relative bg-zinc-950 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all duration-300 overflow-hidden shadow-sm"
              >
                {/* Biểu tượng mũi tên nhỏ góc phải */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <ChevronRight className="text-red-600" size={16} />
                </div>

                <div className="flex justify-between items-start mb-8">
                  <div className="w-11 h-11 bg-[#060608] border border-zinc-900 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:border-transparent transition-colors">
                    <Monitor size={20} className="text-white" />
                  </div>
                  
                  {/* Cụm nút công cụ */}
                  <div className="flex gap-1.5 relative z-10">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDangSuaId(phong.id); setDuLieuForm({name: phong.name, totalSeats: phong.totalSeats}); setHienModal(true); }} 
                      className="p-2 bg-[#060608] border border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-800 rounded-lg transition-all"
                      title="Chỉnh sửa"
                    >
                      <Settings2 size={13} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPhongDangChonXoa({ id: phong.id, name: phong.name }); }} 
                      className="p-2 bg-[#060608] border border-zinc-900 text-zinc-500 hover:text-red-500 hover:border-zinc-800 rounded-lg transition-all"
                      title="Xóa phòng"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Tên phòng chiếu */}
                <h3 className="text-xl font-black text-zinc-200 mb-5 group-hover:text-white uppercase tracking-tight">
                  {phong.name}
                </h3>
                
                {/* Phần chân của thẻ phòng */}
                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Armchair size={13} className="text-zinc-600 group-hover:text-red-600 transition-colors" />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">{phong.totalSeats} Ghế ngồi</span>
                  </div>
                  
                  <button 
                    onClick={() => router.push(`/admin/rooms/${phong.id}`)}
                    className="text-[9px] font-black uppercase text-zinc-700 tracking-wider group-hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    Xem chi tiết <Eye size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL XÁC NHẬN XÓA PHÒNG */}
      {phongDangChonXoa && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPhongDangChonXoa(null)}></div>
          <div className="relative bg-zinc-950 border border-zinc-900 rounded-xl p-8 w-full max-w-sm text-center shadow-2xl">
            <AlertTriangle size={32} className="text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Xác nhận xóa phòng?</h2>
            <p className="text-zinc-500 text-[10px] font-black mb-6 uppercase tracking-wider leading-relaxed">
              Dữ liệu của phòng <br/><span className="text-red-500">"{phongDangChonXoa.name}"</span> <br/> sẽ bị xóa vĩnh viễn khỏi máy chủ.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setPhongDangChonXoa(null)} className="py-3 bg-zinc-900 text-zinc-400 rounded-lg font-black uppercase text-[9px] hover:text-white border border-zinc-800 transition-all">Hủy bỏ</button>
              <button onClick={xacNhanXoa} className="py-3 bg-red-600 text-white rounded-lg font-black uppercase text-[9px] hover:bg-red-700 transition-all">Xóa ngay</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM / SỬA PHÒNG CHIẾU */}
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