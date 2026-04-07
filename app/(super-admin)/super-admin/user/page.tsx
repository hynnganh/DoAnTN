"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, ShieldAlert, Loader2, RefreshCw, 
  ShieldCheck, X, Building2, Check, User as UserIcon
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { apiRequest } from '@/app/lib/api'; 

export default function SuperAdminUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ADMIN" | "USER">("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("USER");
  const [selectedCinema, setSelectedCinema] = useState<number | string>("");
  const [cinemaSearch, setCinemaSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, cinemaRes] = await Promise.all([
        apiRequest('/api/v1/users'),
        apiRequest('/api/v1/cinemas')
      ]);
      const userData = await userRes.json();
      const cinemaData = await cinemaRes.json();
      
      setUsers(userData.data?.content || userData.data || []);
      setCinemas(cinemaData.data || []);
    } catch (err) {
      toast.error("Lỗi đồng bộ dữ liệu hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openRoleModal = (user: any) => {
    // FIX: Kiểm tra role từ mảng string ["ROLE_ADMIN", ...]
    const isAdmin = user.roles?.includes('ROLE_ADMIN');
    setSelectedUser(user);
    setSelectedRole(isAdmin ? "ADMIN" : "USER");
    // Giả định backend trả về cinemaId người đó đang quản lý (nếu có)
    setSelectedCinema(user.cinemaId || ""); 
    setCinemaSearch("");
    setIsModalOpen(true);
  };

  const handleUpdateRole = async () => {
    if (selectedRole === "ADMIN" && !selectedCinema) {
      return toast.error("Vui lòng chỉ định rạp cho Admin!");
    }

    const loadingToast = toast.loading("Đang thực thi lệnh phân quyền...");
    try {
      // Endpoint và Body khớp với nghiệp vụ assign-role
      const res = await apiRequest(`/api/v1/users/${selectedUser.userId}/assign-role`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          role: selectedRole, // "ADMIN" hoặc "USER"
          cinemaId: selectedRole === "ADMIN" ? Number(selectedCinema) : null 
        })
      });

      if (res.ok) {
        toast.success("Cấu hình nhân sự hoàn tất!", { id: loadingToast });
        setIsModalOpen(false);
        fetchData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Không thể cấp quyền!", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ!", { id: loadingToast });
    }
  };

  // Logic lọc User theo Tab và Search
  const filteredUsers = users.filter(u => {
    const matchSearch = (u.firstName + u.lastName + u.email).toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === "ALL") return matchSearch;
    if (activeTab === "ADMIN") return u.roles?.includes("ROLE_ADMIN") && matchSearch;
    if (activeTab === "USER") return !u.roles?.includes("ROLE_ADMIN") && matchSearch;
    return matchSearch;
  });

  const filteredCinemas = cinemas.filter(c => 
    c.name.toLowerCase().includes(cinemaSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans selection:bg-red-600/30">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="text-red-600" size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">SuperAdmin Terminal</span>
          </div>
          <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter leading-none">
            Nhân Sự <span className="text-red-600">Hệ Thống</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
           {/* Thanh tìm kiếm trưởng thành hơn */}
           <div className="relative group w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-red-600 transition-colors" size={14} />
            <input 
              type="text"
              placeholder="SEARCH IDENTITIES..."
              className="w-full bg-zinc-900/30 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-red-600/40 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5">
            {["ALL", "ADMIN", "USER"].map((t) => (
              <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${activeTab === t ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-600 hover:text-white'}`}>
                {t === "ALL" ? "Tất cả" : t === "ADMIN" ? "Quản trị" : "Hội viên"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-[#080808] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/[0.01] text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em] border-b border-white/5">
            <tr>
              <th className="p-8">Thành viên</th>
              <th className="p-8">Vai trò & Vị trí</th>
              <th className="p-8 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {loading ? (
              <tr><td colSpan={3} className="p-32 text-center"><Loader2 className="animate-spin mx-auto text-red-600" size={32} /></td></tr>
            ) : filteredUsers.map((user: any) => (
              <tr key={user.userId} className="hover:bg-white/[0.01] transition-all group">
                <td className="p-8">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-red-600 font-black text-xl italic shadow-inner group-hover:border-red-600/30 transition-all">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-2xl" /> : user.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase italic tracking-tight group-hover:text-red-500 transition-colors">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-zinc-600 font-bold tracking-widest mt-1">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                   <div className="flex flex-col gap-2">
                      <div className={`w-fit px-3 py-1 rounded-md text-[8px] font-black uppercase border ${user.roles?.includes('ROLE_ADMIN') ? 'border-red-600/30 text-red-500 bg-red-600/5' : 'border-zinc-800 text-zinc-600'}`}>
                        {user.roles?.includes('ROLE_ADMIN') ? 'Quản trị hệ thống' : 'Khách hàng'}
                      </div>
                      {user.roles?.includes('ROLE_ADMIN') && (
                        <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold italic">
                           <Building2 size={10} className="text-zinc-700"/> {user.managedCinemaName || "Chưa gán rạp"}
                        </div>
                      )}
                   </div>
                </td>
                <td className="p-8 text-right">
                  <button onClick={() => openRoleModal(user)} className="bg-zinc-900 px-6 py-3 rounded-xl text-[9px] font-black uppercase border border-white/5 hover:bg-white hover:text-black transition-all group-hover:scale-105 active:scale-95">
                    Phân quyền
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL PHÂN QUYỀN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#0c0c0c] border border-white/10 w-full max-w-[380px] rounded-[2.5rem] p-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="mb-8">
              <h2 className="text-2xl font-[1000] uppercase italic text-white tracking-tighter leading-none">Access <span className="text-red-600">Control</span></h2>
              <p className="text-[10px] text-zinc-600 font-bold uppercase mt-2 tracking-widest truncate">{selectedUser?.email}</p>
            </div>

            <div className="space-y-8">
              {/* Chọn vai trò */}
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-zinc-900/50 rounded-2xl border border-white/5">
                {["USER", "ADMIN"].map((role) => (
                  <button 
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`py-3.5 rounded-xl text-[10px] font-black uppercase transition-all ${selectedRole === role ? 'bg-red-600 text-white shadow-xl' : 'text-zinc-600 hover:text-zinc-300'}`}
                  >
                    {role === "ADMIN" ? "Quản trị" : "Thành viên"}
                  </button>
                ))}
              </div>

              {/* Chỉ định rạp (Chỉ khi là ADMIN) */}
              {selectedRole === "ADMIN" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                   <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                     <Building2 size={12} className="text-red-600"/> Cơ sở quản lý
                   </p>
                  
                  <div className="relative border-b border-white/5 focus-within:border-red-600/50 transition-colors">
                    <Search size={12} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-800" />
                    <input 
                      type="text" 
                      placeholder="TÌM KIẾM RẠP..." 
                      className="w-full bg-transparent py-3 pl-6 pr-2 text-[10px] font-black outline-none text-white uppercase tracking-widest placeholder:text-zinc-800"
                      value={cinemaSearch}
                      onChange={(e) => setCinemaSearch(e.target.value)}
                    />
                  </div>

                  <div className="max-h-[160px] overflow-y-auto space-y-1 custom-scrollbar-mini pr-2">
                    {filteredCinemas.map((c) => (
                      <button
                        key={c.cinemaId}
                        onClick={() => setSelectedCinema(c.cinemaId)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl text-[10px] font-black uppercase transition-all ${selectedCinema == c.cinemaId ? 'bg-red-600/10 text-white border border-red-600/20' : 'bg-transparent text-zinc-600 hover:bg-white/[0.03]'}`}
                      >
                        <span className="truncate pr-2">{c.name}</span>
                        {selectedCinema == c.cinemaId && <Check size={14} className="text-red-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button 
                  onClick={handleUpdateRole}
                  className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-2xl shadow-red-600/20 flex items-center justify-center gap-3"
                >
                  Confirm Assignment <Check size={18}/>
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full mt-4 text-[10px] font-black uppercase text-zinc-700 hover:text-zinc-500 tracking-widest transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}