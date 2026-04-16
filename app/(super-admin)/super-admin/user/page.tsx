"use client";
import React, { useState, useEffect } from 'react';
import { Search, Loader2, Building2, User as UserIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { apiRequest } from '@/app/lib/api'; 
import UserRoleModal from './UserRoleModal';

export default function SuperAdminUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ADMIN" | "USER">("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("ROLE_USER");
  const [selectedCinema, setSelectedCinema] = useState<number | string>("");
  const [cinemaSearch, setCinemaSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, cinemaRes] = await Promise.all([
        apiRequest('/api/v1/users'),
        apiRequest('/api/v1/cinema-items')
      ]);
      const userData = await userRes.json();
      const cinemaData = await cinemaRes.json();
      setUsers(userData.data?.content || userData.data || []);
      setCinemas(cinemaData.data || []);
    } catch (err) {
      toast.error("Lỗi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openRoleModal = (user: any) => {
    const isAdmin = user.roles?.includes('ROLE_ADMIN');
    setSelectedUser(user);
    setSelectedRole(isAdmin ? "ROLE_ADMIN" : "ROLE_USER");
    setSelectedCinema(user.managedCinemaItemId || ""); 
    setCinemaSearch("");
    setIsModalOpen(true);
  };

  const handleUpdateRole = async () => {
    if (selectedRole === "ROLE_ADMIN" && !selectedCinema) {
      return toast.error("Vui lòng chọn cơ sở cho Quản trị viên!");
    }

    const loadingToast = toast.loading("Đang cập nhật...");
    try {
      const res = await apiRequest(`/api/v1/users/${selectedUser.userId}/assign-role`, {
        method: 'PUT',
        body: JSON.stringify({ 
          roles: [selectedRole], 
          cinemaItemId: selectedRole === "ROLE_ADMIN" ? Number(selectedCinema) : null 
        })
      });

      if (res.ok) {
        toast.success("Thành công!", { id: loadingToast });
        setIsModalOpen(false);
        fetchData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Lỗi!", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Máy chủ không phản hồi!", { id: loadingToast });
    }
  };

  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''} ${u.email || ''}`.toLowerCase();
    const matchSearch = fullName.includes(searchTerm.toLowerCase());
    if (activeTab === "ALL") return matchSearch;
    const isAdmin = u.roles?.includes('ROLE_ADMIN');
    return activeTab === "ADMIN" ? (isAdmin && matchSearch) : (!isAdmin && matchSearch);
  });

  const filteredCinemas = cinemas.filter(c => 
    (c.address || "").toLowerCase().includes(cinemaSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">Phân hệ SuperAdmin</p>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Nhân Sự <span className="text-zinc-600">Hệ Thống</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 bg-zinc-900/30 p-2 rounded-2xl border border-white/5 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
            <input 
              type="text"
              placeholder="TÌM KIẾM..."
              className="w-full bg-transparent py-2.5 pl-11 pr-4 text-[10px] font-black uppercase outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-1">
            {["ALL", "ADMIN", "USER"].map((t) => (
              <button 
                key={t} 
                onClick={() => setActiveTab(t as any)} 
                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === t ? 'bg-white text-black' : 'text-zinc-600'}`}
              >
                {t === "ALL" ? "Tất cả" : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-[#080808] border border-white/5 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em] border-b border-white/5">
            <tr>
              <th className="p-8">Người dùng</th>
              <th className="p-8">Quyền hạn</th>
              <th className="p-8 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {loading ? (
              <tr><td colSpan={3} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-red-600" /></td></tr>
            ) : filteredUsers.map((user) => {
              const isAdmin = user.roles?.includes('ROLE_ADMIN');
              return (
                <tr key={user.userId} className="hover:bg-white/[0.01] transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-red-600 font-bold overflow-hidden">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-zinc-600 font-bold">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${isAdmin ? 'border-red-600/30 text-red-500 bg-red-600/5' : 'border-zinc-800 text-zinc-600'}`}>
                      {isAdmin ? 'Quản trị' : 'Người dùng'}
                    </span>
                    {isAdmin && (
                      <div className="text-[9px] text-zinc-500 mt-2 flex items-center gap-1">
                        <Building2 size={10}/> 
                        {cinemas.find(c => String(c.id) === String(user.managedCinemaItemId))?.address || "Chưa gán địa chỉ"}
                      </div>
                    )}
                  </td>
                  <td className="p-8 text-right">
                    <button 
                      onClick={() => openRoleModal(user)} 
                      className="bg-zinc-900/50 px-6 py-3 rounded-xl text-[9px] font-black uppercase border border-white/5 hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-95"
                    >
                      Sửa quyền
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL ĐÃ ĐƯỢC CHÈN THÊM allUsers={users} */}
      <UserRoleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedUser={selectedUser}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedCinema={selectedCinema}
        setSelectedCinema={setSelectedCinema}
        cinemaSearch={cinemaSearch}
        setCinemaSearch={setCinemaSearch}
        filteredCinemas={filteredCinemas}
        onConfirm={handleUpdateRole}
        allUsers={users} 
      />
      
      <style jsx>{`
        .custom-scrollbar-mini::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar-mini::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}