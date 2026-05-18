"use client";

import React, { useEffect, useState } from 'react';
import { X, Save, Loader2, Tag, DollarSign, Activity, AlertCircle, LayoutGrid } from 'lucide-react';
import { apiSuperAdminRequest } from '@/app/lib/api'; 

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: any;
  isSubmitting: boolean;
}

export default function VoucherModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: VoucherModalProps) {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [formData, setFormData] = useState({
    code: "", 
    title: "", 
    description: "", 
    discountValue: 0,
    minOrderAmount: 0, 
    usageLimit: 1,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    promotionId: ""
  });

  // Fetch dữ liệu bổ trợ (Chỉ lấy Promotions)
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          const promoRes = await apiSuperAdminRequest('/api/v1/promotions');
          if (promoRes.ok) {
            const result = await promoRes.json();
            setPromotions(result.data || []);
          }
        } catch (error) { 
          console.error("Lỗi fetch promotion:", error); 
        } finally { 
          setLoadingData(false); 
        }
      };
      fetchData();
    }
  }, [isOpen]);

  // Sync dữ liệu khi Edit/Create
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          startDate: new Date(initialData.startDate).toISOString().slice(0, 16),
          endDate: new Date(initialData.endDate).toISOString().slice(0, 16),
          promotionId: initialData.promotion?.id || initialData.promotionId || ""
        });
      } else {
        setFormData({
          code: "", title: "", description: "", discountValue: 0,
          minOrderAmount: 0, usageLimit: 1,
          startDate: new Date().toISOString().slice(0, 16),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          promotionId: ""
        });
      }
    }
  }, [initialData, isOpen]);

  // --- LOGIC RÀNG BUỘC (VALIDATIONS) ---
  const codeRegex = /^[A-Z0-9]{3,15}$/;
  const isCodeInvalid = !codeRegex.test(formData.code);
  const isTitleInvalid = formData.title.trim().length < 5;
  const isUsageLimitInvalid = formData.usageLimit <= 0 || !Number.isInteger(formData.usageLimit);
  const isDiscountInvalid = formData.discountValue <= 0;
  const isMinOrderInvalid = formData.minOrderAmount < 0;
  const isTimeInvalid = new Date(formData.endDate) <= new Date(formData.startDate);
  
  // RÀNG BUỘC MỚI: Số tiền giảm không được lớn hơn giá trị đơn tối thiểu
  const isDiscountGreaterThanMinOrder = formData.discountValue > formData.minOrderAmount;

  // Điều kiện tổng để active nút Submit
  const canSubmit = 
    !isCodeInvalid && 
    !isTitleInvalid && 
    !isUsageLimitInvalid && 
    !isDiscountInvalid && 
    !isMinOrderInvalid && 
    !isTimeInvalid && 
    !isDiscountGreaterThanMinOrder && // Thêm kiểm tra vào đây
    !isSubmitting;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value 
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#060608] border border-zinc-900 p-5 rounded-xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-4">
          <h2 className="text-xs font-black text-white uppercase tracking-tight">
            {initialData ? 'Cập nhật' : 'Thêm mới'} <span className="text-red-600">Voucher</span>
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="w-6 h-6 flex items-center justify-center bg-zinc-950 border border-zinc-900 rounded-lg hover:border-zinc-800 text-zinc-500 hover:text-white transition-all"
          >
            <X size={12} />
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={(e) => { e.preventDefault(); if(canSubmit) onSubmit(formData); }} className="space-y-3 text-[11px]">
          
          {/* MÃ CODE & GIỚI HẠN */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500 flex items-center gap-1.5">
                <Tag size={11} /> Mã định danh (Code)
              </label>
              <input 
                name="code" required 
                value={formData.code} 
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase().replace(/\s/g, '')})}
                className={`w-full bg-zinc-950 border ${formData.code && isCodeInvalid ? 'border-red-900' : 'border-zinc-900'} p-2.5 rounded-xl text-white font-bold outline-none focus:border-zinc-800 transition-all uppercase placeholder:text-zinc-700`} 
                placeholder="VD: MOVIE50" 
              />
              {formData.code && isCodeInvalid && (
                <p className="text-[8px] font-bold text-red-500 uppercase tracking-tight">3-15 ký tự chữ/số, không khoảng trắng</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500 flex items-center gap-1.5">
                <Activity size={11} /> Giới hạn phát hành
              </label>
              <input 
                name="usageLimit" type="number" required min="1"
                value={formData.usageLimit || ''} onChange={handleChange}
                className={`w-full bg-zinc-950 border ${isUsageLimitInvalid ? 'border-red-900' : 'border-zinc-900'} p-2.5 rounded-xl text-white font-bold outline-none focus:border-zinc-800`} 
              />
              {isUsageLimitInvalid && (
                <p className="text-[8px] font-bold text-red-500 uppercase tracking-tight">Phải là số nguyên dương &gt; 0</p>
              )}
            </div>
          </div>

          {/* TIÊU ĐỀ KHUYẾN MÃI */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-500">Tiêu đề hiển thị ứng dụng</label>
            <input 
              name="title" required 
              value={formData.title} onChange={handleChange}
              className={`w-full bg-zinc-950 border ${formData.title && isTitleInvalid ? 'border-red-900' : 'border-zinc-900'} p-2.5 rounded-xl text-white font-bold outline-none focus:border-zinc-800 placeholder:text-zinc-700`} 
              placeholder="Nhập tên chương trình áp dụng mã giảm giá..." 
            />
            {formData.title && isTitleInvalid && (
              <p className="text-[8px] font-bold text-red-500 uppercase tracking-tight">Tiêu đề phải dài tối thiểu 5 ký tự</p>
            )}
          </div>

          {/* SỰ KIỆN */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-500 flex items-center gap-1.5">
              <LayoutGrid size={11} /> Thuộc chiến dịch / Sự kiện
            </label>
            <div className="relative">
              <select
                name="promotionId"
                value={formData.promotionId}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-900 p-2.5 rounded-xl text-white font-bold outline-none focus:border-zinc-800 appearance-none text-zinc-400"
              >
                <option value="">HỆ THỐNG RIÊNG LẺ (KHO KHÔNG THUỘC SỰ KIỆN)</option>
                {promotions.map((p: any) => (
                  <option key={p.id} value={p.id} className="bg-[#060608] text-white">{p.title.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SỐ TIỀN GIẢM & ĐƠN TỐI THIỂU */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500 flex items-center gap-1.5">
                <DollarSign size={11} className="text-red-600"/> Giá trị giảm chiếc
              </label>
              <input 
                name="discountValue" type="number" required min="1"
                value={formData.discountValue || ''} onChange={handleChange}
                className={`w-full bg-zinc-950 border ${isDiscountInvalid || isDiscountGreaterThanMinOrder ? 'border-red-900' : 'border-zinc-900'} p-2.5 rounded-xl text-white font-bold outline-none focus:border-zinc-800`} 
              />
              {isDiscountInvalid && (
                <p className="text-[8px] font-bold text-red-500 uppercase tracking-tight">Mức giảm phải lớn hơn 0</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500">Điều kiện đơn tối thiểu</label>
              <input 
                name="minOrderAmount" type="number" required min="0"
                value={formData.minOrderAmount ?? ''} onChange={handleChange}
                className={`w-full bg-zinc-950 border ${isMinOrderInvalid || isDiscountGreaterThanMinOrder ? 'border-red-900' : 'border-zinc-900'} p-2.5 rounded-xl text-white font-bold outline-none focus:border-zinc-800`} 
              />
              {isMinOrderInvalid && (
                <p className="text-[8px] font-bold text-red-500 uppercase tracking-tight">Giá trị đơn không được âm</p>
              )}
            </div>
          </div>

          {/* THÔNG BÁO LỖI LOGIC GIẢM GIÁ / ĐƠN TỐI THIỂU */}
          {isDiscountGreaterThanMinOrder && !isDiscountInvalid && !isMinOrderInvalid && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/5 border border-red-950/40 p-2 rounded-lg">
              <AlertCircle size={12} />
              <p className="text-[9px] font-black uppercase tracking-wide">Lỗi: Giá trị đơn tối thiểu không được thấp hơn mức giảm giá!</p>
            </div>
          )}

          {/* NGÀY HIỆU LỰC */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500">Hiệu lực từ ngày</label>
              <input 
                name="startDate" type="datetime-local" required 
                value={formData.startDate} onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-900 p-2.5 rounded-xl text-white font-bold outline-none focus:border-zinc-800 [color-scheme:dark]" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-500">Thời hạn đóng mã</label>
              <input 
                name="endDate" type="datetime-local" required 
                value={formData.endDate} onChange={handleChange}
                className={`w-full bg-zinc-950 border ${isTimeInvalid ? 'border-red-600' : 'border-zinc-900'} p-2.5 rounded-xl text-white font-bold outline-none focus:border-zinc-800 transition-colors [color-scheme:dark]`} 
              />
            </div>
          </div>

          {/* CẢNH BÁO LỖI THỜI GIAN */}
          {isTimeInvalid && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/5 border border-red-950/40 p-2 rounded-lg">
              <AlertCircle size={12} />
              <p className="text-[9px] font-black uppercase tracking-wide">Cảnh báo: Thời gian đóng mã phải sau mốc bắt đầu kích hoạt!</p>
            </div>
          )}

          {/* BUTTON ACTION GỌN HÀNG */}
          <div className="pt-1.5">
            <button 
              type="submit" 
              disabled={!canSubmit}
              className="w-full h-10 bg-red-600 disabled:bg-zinc-900/50 text-white disabled:text-zinc-600 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md border border-transparent disabled:border-zinc-900/20"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin text-white opacity-80" size={14} />
              ) : (
                <><Save size={14} /> {initialData ? "Lưu thay đổi" : "Kích hoạt tạo mã mới"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}