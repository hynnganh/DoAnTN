"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit3, Ticket, Calendar, Hash, Loader2, AlertCircle, Lock } from 'lucide-react';
import { apiSuperAdminRequest } from '@/app/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import VoucherModal from './VoucherModal';

export interface Voucher {
  id: number;
  code: string;
  title: string;
  discountValue: number;
  usedCount: number;
  usageLimit: number;
  endDate: string;
}

export default function AdminVoucherManager() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await apiSuperAdminRequest('/api/v1/vouchers');
      if (res.ok) {
        const json = await res.json();
        setVouchers(json.data || []);
      }
    } catch (e) {
      toast.error("Lỗi kết nối database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVouchers(); }, []);

  const formatCurrency = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';
  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');

  // Đã sửa: Định nghĩa nhận Voucher hoặc null chuẩn xác
  const handleOpenModal = (voucher: Voucher | null = null) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const method = selectedVoucher ? 'PUT' : 'POST';
      const url = selectedVoucher ? `/api/v1/vouchers/${selectedVoucher.id}` : '/api/v1/vouchers';
      const res = await apiSuperAdminRequest(url, { method, body: JSON.stringify(data) });
      
      if (res.ok) {
        toast.success(selectedVoucher ? "Đã cập nhật!" : "Đã tạo mã mới!");
        fetchVouchers();
        setIsModalOpen(false);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Thao tác thất bại");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedVoucher) return;
    if (selectedVoucher.usedCount > 0) {
      toast.error("Voucher này đã có người lưu, không thể xóa!");
      setDeleteModalOpen(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiSuperAdminRequest(`/api/v1/vouchers/${selectedVoucher.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Đã xóa vĩnh viễn");
        fetchVouchers();
        setDeleteModalOpen(false);
      } else {
        const result = await res.json();
        toast.error(result.message || "Không thể xóa do ràng buộc dữ liệu");
      }
    } catch (e) {
      toast.error("Lỗi hệ thống");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVouchers = vouchers.filter(v => 
    v.code?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-400 p-4 md:p-6 font-sans tracking-tight select-none">
      
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/10 border border-red-600/20 rounded-lg text-red-600">
              <Ticket size={16} />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-lg font-black uppercase tracking-tight text-white leading-none">
                Trung tâm <span className="text-red-600">Voucher</span>
              </h1>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none">
                Hệ thống quản lý điều hành mã giảm giá thực tế • Quyền SUPER_ADMIN
              </p>
            </div>
          </div>
          {/* Đã sửa: Truyền null rõ ràng để kích hoạt Form thêm mới */}
          <button 
            onClick={() => handleOpenModal(null)}
            className="h-9 bg-red-600 hover:bg-red-500 text-white px-4 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Plus size={13} /> Tạo mới
          </button>
        </div>

        {/* INPUT TÌM KIẾM CHUẨN FORM SẮC NÉT */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={13} />
          <input 
            type="text" 
            placeholder="TÌM KIẾM MÃ VOUCHER, TIÊU ĐỀ KHUYẾN MÃI..." 
            className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-3 pl-11 text-[10px] font-black tracking-wider outline-none focus:border-zinc-800 placeholder:text-zinc-700 text-white uppercase"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* BẢNG DỮ LIỆU ĐƯỢC THU GỌN ROW HEIGHT THEO CHUẨN BASIC */}
        <div className="bg-[#060608] border border-zinc-900 rounded-xl overflow-hidden relative min-h-[400px] shadow-sm">
          {loading && (
            <div className="absolute inset-0 bg-[#020202]/80 z-10 flex items-center justify-center backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-red-600 opacity-80" size={24} />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Đang truy xuất...</span>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/60 border-b border-zinc-900 text-[9px] font-black uppercase text-zinc-600 tracking-wider">
                  <th className="py-3.5 px-6 w-[240px]">Thông tin Voucher</th>
                  <th className="py-3.5 px-4 w-[150px]">Mức giảm giá</th>
                  <th className="py-3.5 px-4 w-[180px]">Giới hạn sử dụng</th>
                  <th className="py-3.5 px-4 w-[140px]">Ngày hết hạn</th>
                  <th className="py-3.5 px-6 w-[120px] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/30 text-[11px]">
                {filteredVouchers.length > 0 ? filteredVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-950/40 group transition-all">
                    
                    {/* Thông tin Voucher */}
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-red-600 group-hover:border-red-900/20 transition-colors">
                          <Hash size={12} />
                        </div>
                        <div className="space-y-0.5 max-w-[180px]">
                          <p className="font-black tracking-tight text-zinc-200 uppercase">#{v.code}</p>
                          <p className="text-[9px] font-bold text-zinc-600 uppercase truncate leading-none">
                            {v.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Giảm giá */}
                    <td className="py-3 px-4 font-black text-zinc-200 tracking-tight">
                      {v.discountValue < 100 ? `-${v.discountValue}%` : `-${formatCurrency(v.discountValue)}`}
                    </td>

                    {/* Sử dụng */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 w-32">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase">
                          <span className="text-zinc-500">{v.usedCount}/{v.usageLimit}</span>
                          <span className="text-zinc-600">{Math.round((v.usedCount / v.usageLimit) * 100)}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/[0.02]">
                          <div 
                            className={`h-full transition-all duration-500 ${v.usedCount >= v.usageLimit ? 'bg-zinc-700' : 'bg-red-600'}`} 
                            style={{ width: `${Math.min((v.usedCount / v.usageLimit) * 100, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </td>

                    {/* Hiệu lực */}
                    <td className="py-3 px-4 text-zinc-400 text-[10px] font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-zinc-600" />
                        <span>{formatDate(v.endDate)}</span>
                      </div>
                    </td>

                    {/* Thao tác tác vụ */}
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleOpenModal(v)} 
                          className="w-7 h-7 inline-flex items-center justify-center bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-600 hover:text-white rounded-lg transition-all active:scale-95"
                          title="Chỉnh sửa voucher"
                        >
                          <Edit3 size={12} />
                        </button>

                        {v.usedCount > 0 ? (
                          <div className="relative group/lock">
                            <button 
                              className="w-7 h-7 inline-flex items-center justify-center bg-zinc-950 border border-zinc-900/40 text-zinc-800 rounded-lg cursor-not-allowed"
                              disabled
                            >
                              <Lock size={12} className="opacity-30" />
                            </button>
                            <div className="absolute bottom-full right-0 mb-2 w-36 p-2 bg-red-600 text-white text-[8px] font-black uppercase rounded-md opacity-0 group-hover/lock:opacity-100 transition-all pointer-events-none translate-y-1 group-hover/lock:translate-y-0 shadow-lg text-center z-20">
                              Đã có khách sử dụng
                              <div className="absolute top-full right-2.5 border-4 border-transparent border-t-red-600" />
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => { setSelectedVoucher(v); setDeleteModalOpen(true); }} 
                            className="w-7 h-7 inline-flex items-center justify-center bg-zinc-950 border border-zinc-900 hover:border-red-950 hover:text-red-500 rounded-lg text-zinc-600 transition-all active:scale-95"
                            title="Xóa voucher"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                )) : !loading && (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-[9px] font-black uppercase text-zinc-600 tracking-widest">
                      Không tìm thấy dữ liệu voucher tương thích
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL VOUCHER FORM THÊM/SỬA */}
      <VoucherModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedVoucher}
        isSubmitting={isSubmitting}
      />

      {/* MODAL XÓA CHUẨN ĐỒNG BỘ LAYOUT BASIC */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)} />
          <div className="relative bg-[#060608] border border-zinc-900 p-6 rounded-xl max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={20} />
            </div>
            <h3 className="text-sm font-black text-white text-center uppercase tracking-tight">Xác nhận xóa dữ liệu?</h3>
            <p className="text-zinc-500 text-[10px] font-medium text-center mt-2 leading-relaxed uppercase">
              Mã <span className="text-white font-bold">{selectedVoucher?.code}</span> sẽ bị gỡ bỏ vĩnh viễn khỏi core hệ thống.
            </p>
            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => setDeleteModalOpen(false)} 
                className="flex-1 py-2.5 rounded-lg bg-zinc-950 border border-zinc-900 hover:bg-zinc-900 text-zinc-500 text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleDelete} 
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center"
              >
                {isSubmitting ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}