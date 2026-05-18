"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ShoppingBag, Loader2, Search, CheckCircle2, XCircle } from "lucide-react";
import { apiRequest } from "@/app/lib/api";
import toast, { Toaster } from "react-hot-toast";

interface ComboAdmin {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  available: boolean; 
}

export default function AdminComboPage() {
  const [combos, setCombos] = useState<ComboAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getAdminToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token_admin") || "";
    }
    return "";
  };

  const loadCombos = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const token = getAdminToken();

      const res = await apiRequest("/api/v1/admin/cinema-combos", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      const result = await res.json();
      
      if (res.ok) {
        const data = Array.isArray(result) ? result : (result.data || []);
        setCombos(data);
      } else {
        toast.error(result.message || "Không thể tải danh mục combo");
      }
    } catch (e) {
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCombos();
  }, [loadCombos]);

  const handleToggle = async (comboId: number) => {
    if (togglingId) return;
    setTogglingId(comboId);

    try {
      const token = getAdminToken();

      const res = await apiRequest(`/api/v1/admin/cinema-combos/${comboId}/toggle`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        setCombos((prev) =>
          prev.map((c) =>
            c.id === comboId ? { ...c, available: !c.available } : c
          )
        );
        toast.success("Đã cập nhật trạng thái combo thành công");
      } else {
        toast.error("Không thể cập nhật trạng thái");
      }
    } catch (e) {
      toast.error("Lỗi kết nối mạng");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredCombos = combos.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-400 p-4 font-sans antialiased select-none tracking-tight">      
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto space-y-5">
        
        {/* Thanh tìm kiếm và Tiêu đề */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center shadow-sm shadow-orange-900/20">
                <ShoppingBag size={16} className="text-white" />
              </div>
              <h1 className="text-base font-black uppercase tracking-tight text-white">Thực đơn chi nhánh</h1>
            </div>
            <p className="text-[8px] text-zinc-500 font-black uppercase tracking-wider">
              Chi nhánh quản lý: <span className="text-orange-500">Hệ thống A&K Cinema</span>
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              type="text"
              placeholder="Tìm tên combo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-md py-1.5 pl-9 pr-3 text-[11px] focus:border-orange-500 outline-none transition-all placeholder:text-zinc-600 text-white"
            />
          </div>
        </div>

        {/* Lưới danh sách món ăn / Combo */}
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-2.5">
            <Loader2 className="animate-spin text-orange-500" size={26} />
            <span className="text-[9px] font-black text-zinc-600 tracking-wider uppercase">Đang đồng bộ thực đơn...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredCombos.map((combo) => (
              <div 
                key={combo.id} 
                className={`group bg-zinc-950 border border-zinc-900 transition-all rounded-lg overflow-hidden flex flex-col ${
                  combo.available 
                    ? "hover:border-zinc-800" 
                    : "bg-zinc-950/40 opacity-55 grayscale"
                }`}
              >
                {/* Phần hình ảnh thu hẹp tỷ lệ ngang */}
                <div className="aspect-[4/3] w-full bg-zinc-900 border-b border-zinc-900 relative overflow-hidden">
                  <img 
                    src={combo.imageUrl || "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?q=80&w=400"} 
                    alt={combo.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    {combo.available ? (
                      <div className="bg-green-600 text-white p-0.5 rounded-full shadow-sm">
                        <CheckCircle2 size={10} />
                      </div>
                    ) : (
                      <div className="bg-zinc-950 text-zinc-500 p-0.5 rounded-full border border-zinc-900">
                        <XCircle size={10} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Phần nội dung mô tả nhỏ gọn */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className={`text-[11px] font-black uppercase tracking-tight line-clamp-1 ${combo.available ? 'text-white' : 'text-zinc-500'}`}>
                      {combo.name}
                    </h3>
                    <p className="text-[9px] text-zinc-500 line-clamp-2 leading-normal min-h-[26px]">
                      {combo.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className={`text-[11px] font-black ${combo.available ? 'text-orange-500' : 'text-zinc-600'}`}>
                      {Number(combo.price).toLocaleString()}đ
                    </span>

                    {/* Công tắc Toggle thu nhỏ */}
                    <button
                      onClick={() => handleToggle(combo.id)}
                      disabled={togglingId === combo.id}
                      className={`relative inline-flex h-4.5 w-8 items-center rounded-full transition-colors duration-200 ${
                        combo.available ? "bg-orange-600" : "bg-zinc-900"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                          combo.available ? "translate-x-4.5" : "translate-x-0.5"
                        }`}
                      />
                      {togglingId === combo.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full">
                          <Loader2 size={8} className="animate-spin text-white" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trạng thái danh sách rỗng */}
        {!loading && filteredCombos.length === 0 && (
          <div className="py-24 text-center border border-dashed border-zinc-900 rounded-lg bg-zinc-950/20">
            <ShoppingBag className="mx-auto text-zinc-800 mb-2" size={24} />
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">Không có combo nào phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
}