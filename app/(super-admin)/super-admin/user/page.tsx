"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, ShieldAlert, Loader2, RefreshCw, 
  Users, ShieldCheck, X, Building2, Check
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { apiRequest } from '@/app/lib/api'; 

export default function SuperAdminUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ADMIN" | "USER">("ALL");

  // State cho Modal phân quyền
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("USER");
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [cinemaSearch, setCinemaSearch] = useState(""); // Tìm kiếm rạp trong modal

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, cinemaRes] = await Promise.all([
        apiRequest('/api/v1/users'),
        apiRequest('/api/v1/cinemas')
      ]);
      const userData = await userRes.json();
      const cinemaData = await cinemaRes.json();
      setUsers(userData.data?.content || userData.data || userData);
      setCinemas(cinemaData.data || cinemaData);
    } catch (err) {
      toast.error("Lỗi đồng bộ dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openRoleModal = (user: any) => {
    const isAdmin = user.roles?.some((r: any) => r.roleName === 'ROLE_ADMIN');
    setSelectedUser(user);
    setSelectedRole(isAdmin ? "ADMIN" : "USER");
    setSelectedCinema(user.managedCinemaId || ""); 
    setCinemaSearch(""); // Reset tìm kiếm rạp khi mở mới
    setIsModalOpen(true);
  };

  const handleUpdateRole = async () => {
    const loadingToast = toast.loading("Đang thực thi lệnh...");
    try {
      const res = await apiRequest(`/api/v1/users/${selectedUser.userId}/assign-role`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          role: selectedRole,
          cinemaId: selectedRole === "ADMIN" ? selectedCinema : null 
        })
      });
      if (res.ok) {
        toast.success("Cấu hình hoàn tất!", { id: loadingToast });
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error("Lỗi máy chủ!", { id: loadingToast });
    }
  };

  // Lọc rạp trong modal
  const filteredCinemas = cinemas.filter(c => 
    c.name.toLowerCase().includes(cinemaSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-2 md:p-5 font-sans selection:bg-red-600/30">
      <Toaster position="top-right" />
      
      {/* Header & Main Search */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-red-600" size={28} />
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Nhân Sự <span className="text-red-600">Hệ Thống</span></h1>
        </div>
        <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5">
          {["ALL", "ADMIN", "USER"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === t ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
              {t === "ALL" ? "Tất cả" : t === "ADMIN" ? "Quản trị" : "Hội viên"}
            </button>
          ))}
        </div>
      </div>
<div className="relative mt-6 mb-5 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" size={16} />
                    <input 
                      type="text"
                      value={searchTerm}
                      placeholder="Tìm theo tên....."
                      className="bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs text-white focus:outline-none focus:border-red-500/50 w-80 transition-all focus:bg-zinc-900 focus:shadow-[0_0_20px_rgba(220,38,38,0.1)]"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
      {/* Bảng Danh Sách Người Dùng */}
      <div className="max-w-6xl mx-auto bg-[#080808] border border-white/5 rounded-2xl overflow-hidden shadow-2xl mb-10">
        
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] text-[9px] font-black uppercase text-zinc-600 tracking-widest border-b border-white/5">
            <tr>
              <th className="p-5">Thành viên</th>
              <th className="p-5">Cấp bậc</th>
              <th className="p-5 text-right">Lệnh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {loading ? (
              <tr><td colSpan={3} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-red-600" /></td></tr>
            ) : users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((user: any) => (
              <tr key={user.userId} className="hover:bg-white/[0.01] transition-colors group">
                <td className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-red-600 font-black italic shadow-inner">{user.firstName?.charAt(0)}</div>
                  <div><p className="text-xs font-black uppercase tracking-tight leading-tight">{user.firstName} {user.lastName}</p><p className="text-[10px] text-zinc-500 font-medium">{user.email}</p></div>
                </td>
                <td className="p-5">
                   <div className={`inline-block px-3 py-1 rounded-md text-[8px] font-black uppercase border ${user.roles?.some((r: any) => r.roleName === 'ROLE_ADMIN') ? 'border-red-600/30 text-red-500 bg-red-600/5' : 'border-zinc-800 text-zinc-600'}`}>
                      {user.roles?.some((r: any) => r.roleName === 'ROLE_ADMIN') ? 'Quản trị viên' : 'Thành viên'}
                   </div>
                </td>
                <td className="p-5 text-right">
                  <button onClick={() => openRoleModal(user)} className="bg-zinc-900 px-4 py-2 rounded-lg text-[9px] font-black uppercase border border-white/5 hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all shadow-xl">Thiết lập</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL PHÂN QUYỀN (FIX GIAO DIỆN XINH XINH) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#0c0c0c] border border-white/10 w-full max-w-[340px] rounded-[2rem] p-8 shadow-[-20px_0_60px_rgba(0,0,0,0.7)] overflow-hidden">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-black uppercase italic text-white tracking-tighterleading-none">Cấp Quyền <span className="text-red-600">Node</span></h2>
                <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1.5 tracking-widest">{selectedUser?.email}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/5 rounded-full transition-colors text-zinc-600 hover:text-white"><X size={16}/></button>
            </div>

            <div className="space-y-6">
              {/* Chọn vai trò - Gọn gàng */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-lg border border-white/5">
                {["USER", "ADMIN"].map((role) => (
                  <button 
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`py-2.5 rounded-md text-[9px] font-black uppercase transition-all ${selectedRole === role ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-600 hover:text-white'}`}
                  >
                    {role === "ADMIN" ? "Quản trị" : "Hội viên"}
                  </button>
                ))}
              </div>

              {/* Tìm kiếm & Chọn Rạp - FIX XINH XINH */}
              {selectedRole === "ADMIN" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                   <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest flex items-center gap-2"><Building2 size={10} className="text-red-600"/> Chỉ định rạp quản lý</p>
                  
                  {/* Ô tìm kiếm nhỏ nhắn xinh xinh */}
                  <div className="relative group/search border-b border-white/5 focus-within:border-red-600/50 transition-colors">
                    <Search size={12} className="absolute left-1 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within/search:text-red-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Tìm nhanh tên rạp..." 
                      className="w-full bg-transparent py-2 pl-6 pr-2 text-[10px] font-bold outline-none placeholder:text-zinc-800 placeholder:font-medium text-white"
                      value={cinemaSearch}
                      onChange={(e) => setCinemaSearch(e.target.value)}
                    />
                  </div>

                  {/* Danh sách rạp - Gọn nhẹ */}
                  <div className="max-h-[140px] overflow-y-auto space-y-0.5 custom-scrollbar-mini pr-1">
                    {filteredCinemas.length > 0 ? filteredCinemas.map((c) => (
                      <button
                        key={c.cinemaId}
                        onClick={() => setSelectedCinema(c.cinemaId)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-md text-[10px] font-bold transition-all ${selectedCinema == c.cinemaId ? 'bg-red-600/10 text-white' : 'bg-transparent text-zinc-500 hover:bg-white/[0.02] hover:text-zinc-200'}`}
                      >
                        <span className="line-clamp-1">{c.name}</span>
                        {selectedCinema == c.cinemaId && <Check size={12} className="text-red-600 shrink-0" />}
                      </button>
                    )) : (
                      <p className="text-center py-4 text-[9px] text-zinc-800 font-bold uppercase tracking-widest italic">Không có dữ liệu rạp</p>
                    )}
                  </div>
                </div>
              )}

              <button 
                onClick={handleUpdateRole}
                className="w-full bg-white text-black py-4 rounded-xl font-[1000] uppercase text-[10px] tracking-[0.2em] mt-2 hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-2xl shadow-red-600/10"
              >
                Xác nhận cấp quyền <Check size={16}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}