"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, UserCheck, UserX, Shield, ShieldAlert,
  Trash2, Mail, Phone, Loader2, RefreshCw
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function SuperAdminUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getAuthHeader = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/v1/users', {
        headers: getAuthHeader()
      });
      const result = await res.json();
      
      if (res.ok) {
        // Spring Boot Pageable trả về content, hoặc List trực tiếp
        const userData = result.data?.content || result.data || [];
        setUsers(userData);
      }
    } catch (err) {
      toast.error("Lỗi kết nối Server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/users/${userId}/status`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify({ enabled: !currentStatus })
      });
      if (res.ok) {
        toast.success("Cập nhật trạng thái thành công!");
        fetchUsers();
      }
    } catch (err) {
      toast.error("Lỗi cập nhật!");
    }
  };

  const changeUserRole = async (userId: number, roles: any[]) => {
    // FIX: Map theo đúng trường roleName trong Entity Role của bà
    const isAdmin = roles.some(r => r.roleName === 'ROLE_ADMIN');
    const newRole = isAdmin ? 'ROLE_USER' : 'ROLE_ADMIN';
    
    if (!window.confirm(`Xác nhận đổi quyền thành ${newRole}?`)) return;

    try {
      const res = await fetch(`http://localhost:8080/api/v1/users/${userId}/role`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        toast.success("Phân quyền hoàn tất!");
        fetchUsers();
      }
    } catch (err) {
      toast.error("Không thể đổi quyền!");
    }
  };

  const deleteUser = async (userId: number) => {
    if (!window.confirm("Xóa vĩnh viễn người dùng này khỏi hệ thống?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) {
        toast.success("Đã xóa dữ liệu!");
        setUsers(users.filter(u => u.userId !== userId));
      }
    } catch (err) {
      toast.error("Lỗi xóa user!");
    }
  };

  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 font-sans selection:bg-red-600/30">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-600/10 rounded-3xl border border-red-600/20 shadow-[0_0_20px_rgba(220,38,38,0.15)]">
            <ShieldAlert className="text-red-600 animate-pulse" size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter">
              A&K <span className="text-red-600">SYSTEM</span>
            </h1>
            <p className="text-zinc-500 font-black uppercase text-[9px] tracking-[0.4em] mt-1">Root Access • User Integrity Control</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input 
              type="text" 
              placeholder="Truy tìm danh tính..." 
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-red-600/50 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={fetchUsers} className="p-4 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-white hover:text-black transition-all">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/30 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Database Identity</th>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Contact Info</th>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Role Level</th>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Status</th>
              <th className="p-8 text-[10px] font-black uppercase text-zinc-500 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="p-32 text-center"><Loader2 className="animate-spin text-red-600 mx-auto" size={40} /></td></tr>
            ) : filteredUsers.map((user: any) => {
              // FIX: Dùng roleName từ Entity Role của bà
              const isAdmin = user.roles?.some((r: any) => r.roleName === 'ROLE_ADMIN');
              const isSuper = user.roles?.some((r: any) => r.roleName === 'ROLE_SUPER_ADMIN');

              return (
                <tr key={user.userId} className="hover:bg-white/[0.01] transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center font-black text-red-600 text-2xl italic shadow-md">
                        {user.firstName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-black uppercase italic text-sm">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-zinc-600 font-bold mt-1">ID: AK-{user.userId}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-8">
                    <div className="space-y-1">
                      <p className="text-[13px] text-zinc-400 font-bold">{user.email}</p>
                      <p className="text-[11px] text-zinc-500">{user.mobileNumber || '---'}</p>
                    </div>
                  </td>

                  <td className="p-8">
                    <button 
                      onClick={() => !isSuper && changeUserRole(user.userId, user.roles)}
                      disabled={isSuper}
                      className={`px-4 py-2 rounded-xl border text-[10px] font-black tracking-tighter uppercase transition-all ${
                        isSuper ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' :
                        isAdmin ? 'border-red-600/30 text-red-500 bg-red-600/5' : 
                        'border-white/5 text-zinc-500 hover:border-white/20'
                      }`}
                    >
                      {isSuper ? 'SUPER' : isAdmin ? 'ADMIN' : 'USER'}
                    </button>
                  </td>

                  <td className="p-8">
                    <div className={`inline-flex items-center gap-2 ${user.enabled !== false ? 'text-emerald-500' : 'text-red-600'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.enabled !== false ? 'bg-emerald-500' : 'bg-red-600'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{user.enabled !== false ? 'Live' : 'Locked'}</span>
                    </div>
                  </td>

                  <td className="p-8">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => toggleUserStatus(user.userId, user.enabled)}
                        className={`p-4 rounded-2xl ${user.enabled !== false ? 'bg-zinc-900 text-zinc-500 hover:bg-red-600 hover:text-white' : 'bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600 hover:text-white'}`}
                      >
                        {user.enabled !== false ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                      {!isSuper && (
                        <button onClick={() => deleteUser(user.userId)} className="p-4 bg-zinc-900 text-zinc-600 hover:bg-white hover:text-red-600 rounded-2xl">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}