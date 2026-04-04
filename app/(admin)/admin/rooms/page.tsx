"use client";

import React, { useState, useEffect } from 'react';
import { 
  Loader2, Monitor, Armchair, Trash2, 
  Building2, AlertTriangle, Settings2, ChevronRight 
} from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import để chuyển trang
import toast from 'react-hot-toast';
import { apiRequest } from '@/app/lib/api';
import FormPhongChieu from './RoomForm';

export default function QuanLyPhongCompact() {
  const router = useRouter(); // Khởi tạo router
  const ID_RAP_GIA_LAP = 1;
  const [phongChieu, setPhongChieu] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  
  const [hienModal, setHienModal] = useState(false);
  const [dangSuaId, setDangSuaId] = useState<number | null>(null);
  const [duLieuForm, setDuLieuForm] = useState({ name: '', totalSeats: 0, cinemaItemId: ID_RAP_GIA_LAP });
  const [phongDangChonXoa, setPhongDangChonXoa] = useState<{id: number, name: string} | null>(null);

  const taiDanhSachPhong = async () => {
    try {
      setDangTai(true);
      const res = await apiRequest(`/api/v1/rooms/cinema-item/${ID_RAP_GIA_LAP}`);
      const ketQua = await res.json();
      setPhongChieu(ketQua.data || []);
    } catch (err) { 
      toast.error("Không thể kết nối máy chủ!"); 
    } finally { setDangTai(false); }
  };

  useEffect(() => { taiDanhSachPhong(); }, []);

  // --- LOGIC ĐIỀU HƯỚNG ---
  const toiTrangChiTiet = (id: number) => {
    router.push(`/admin/rooms/${id}`); // Chuyển đến trang sơ đồ ghế
  };

  // --- LOGIC MỞ FORM SỬA (Chặn sủi bọt sự kiện) ---
  const moFormSua = (e: React.MouseEvent, phong: any) => {
    e.stopPropagation(); // Ngăn không cho sự kiện click lan ra Card (không bị nhảy trang)
    setDangSuaId(phong.id);
    setDuLieuForm({ name: phong.name, totalSeats: phong.totalSeats, cinemaItemId: ID_RAP_GIA_LAP });
    setHienModal(true);
  };

  const yeuCauXoa = (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation(); // Ngăn không cho nhảy trang chi tiết
    setPhongDangChonXoa({ id, name });
  };

  const xacNhanXoaPhong = async () => {
    if (!phongDangChonXoa) return;
    const { id, name } = phongDangChonXoa;
    setPhongDangChonXoa(null);
    const thongBaoCho = toast.loading(`Đang gỡ bỏ ${name}...`);
    try {
      const res = await apiRequest(`/api/v1/rooms/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(`Đã xóa thành công!`, { id: thongBaoCho });
        taiDanhSachPhong();
      } else {
        toast.error("Phòng này đang có lịch chiếu!", { id: thongBaoCho });
      }
    } catch (err) { toast.error("Lỗi hệ thống!", { id: thongBaoCho }); }
  };

  const xuLyLuu = async (e: React.FormEvent) => {
    e.preventDefault();
    const dangSua = !!dangSuaId;
    const url = dangSua ? `/api/v1/rooms/${dangSuaId}` : '/api/v1/rooms';
    const thongBaoCho = toast.loading("Đang xử lý...");
    try {
      const res = await apiRequest(url, { 
        method: dangSua ? 'PUT' : 'POST', 
        body: JSON.stringify(duLieuForm) 
      });
      if (res.ok) {
        toast.success(dangSua ? "Đã cập nhật!" : "Đã thêm phòng!", { id: thongBaoCho });
        setHienModal(false);
        taiDanhSachPhong();
      }
    } catch (err) { toast.error("Lỗi xử lý!", { id: thongBaoCho }); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 p-2 font-sans relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-zinc-900 rounded-2xl text-red-600 shadow-2xl border border-white/5"><Building2 size={24}/></div>
            <h1 className="text-2xl font-[1000] uppercase italic text-white tracking-tighter">
              RẠP CHIẾU <span className="text-red-600">SỐ 01</span>
            </h1>
          </div>
          <button 
            onClick={() => { setDangSuaId(null); setDuLieuForm({name:'', totalSeats:0, cinemaItemId: ID_RAP_GIA_LAP}); setHienModal(true); }} 
            className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all active:scale-95"
          >
            + Thêm phòng
          </button>
        </div>

        {dangTai ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600" size={32} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {phongChieu.map((phong) => (
              <div 
                key={phong.id} 
                onClick={() => toiTrangChiTiet(phong.id)} 
                className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 hover:border-red-600/40 transition-all cursor-pointer shadow-xl overflow-hidden"
              >
                {/* Mũi tên chỉ dẫn hiện khi hover */}
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <ChevronRight className="text-red-600" size={20} />
                </div>

                <div className="flex justify-between items-start mb-10">
                  <Monitor size={24} className="text-zinc-800 group-hover:text-red-600 transition-colors" />
                  
                  <div className="flex gap-2">
                    {/* NÚT SỬA */}
                    <button 
                      onClick={(e) => moFormSua(e, phong)} 
                      className="p-3 bg-zinc-900/50 hover:bg-white hover:text-black rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Sửa thông tin"
                    >
                      <Settings2 size={14} />
                    </button>
                    {/* NÚT XÓA */}
                    <button 
                      onClick={(e) => yeuCauXoa(e, phong.id, phong.name)} 
                      className="p-3 bg-zinc-900/50 hover:bg-red-600 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Xóa phòng"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black uppercase italic text-zinc-200 group-hover:text-white transition-colors">{phong.name}</h3>
                <div className="mt-4 pt-4 border-t border-white/[0.03] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Armchair size={12} className="text-zinc-700" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{phong.totalSeats} Ghế</span>
                  </div>
                  <span className="text-[8px] font-black uppercase text-zinc-800 tracking-widest group-hover:text-red-800 transition-colors">Xem sơ đồ</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL XÁC NHẬN XÓA */}
      {phongDangChonXoa && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setPhongDangChonXoa(null)}></div>
          <div className="relative bg-[#0f0f11] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-lg font-black uppercase italic text-white mb-2">Xác nhận gỡ bỏ?</h2>
            <p className="text-zinc-500 text-xs font-bold mb-8 italic px-4">Bà chắc chắn muốn xóa "{phongDangChonXoa.name}" chứ?</p>
            <div className="flex gap-3">
              <button onClick={() => setPhongDangChonXoa(null)} className="flex-1 py-4 bg-zinc-900 text-zinc-500 rounded-xl font-black uppercase text-[10px] hover:text-white transition-all">Hủy</button>
              <button onClick={xacNhanXoaPhong} className="flex-1 py-4 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] hover:bg-red-700">Xóa ngay</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM THÊM/SỬA */}
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