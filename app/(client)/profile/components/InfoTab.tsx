"use client";
import React, { useEffect, useState } from 'react';
import { 
  User as UserIcon, Phone, Mail, Loader2, Calendar, 
  UserCircle, Save, XCircle, Edit3, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { apiRequest } from '../../../lib/api'; 

export default function InfoTab() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); 
  const [formData, setFormData] = useState<any>({}); 
  const [updating, setUpdating] = useState(false); 
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // FETCH DỮ LIỆU TẬN DỤNG apiRequest
  const fetchProfile = async () => {
    try {
      const res = await apiRequest('/api/v1/users/me'); // Không cần truyền headers/token thủ công nữa

      if (res.ok) {
        const result = await res.json();
        const rawData = result.data?.user || result.data || result;
        setUserData(rawData);
        setFormData({
          firstName: rawData.firstName || '',
          lastName: rawData.lastName || '',
          mobileNumber: rawData.mobileNumber || '',
          gender: rawData.gender || '',
          dateOfBirth: formatToInputDate(rawData.dateOfBirth || rawData.date_of_birth)
        });
      }
    } catch (err) {
      console.error("Lỗi fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatToInputDate = (dob: any) => {
    if (!dob) return "";
    if (Array.isArray(dob) && dob.length >= 3) {
      const [y, m, d] = dob;
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    const d = new Date(dob);
    return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UPDATE DỮ LIỆU TẬN DỤNG apiRequest
  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobileNumber: formData.mobileNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        avatar: userData?.avatar || "" 
      };

      const res = await apiRequest('/api/v1/users/me', {
        method: 'PUT',
        body: JSON.stringify(payload) 
      });

      if (res.ok) {
        showToast("Cập nhật thông tin thành công!", "success");
        setIsEditing(false);
        fetchProfile();
      } else {
        const error = await res.json();
        showToast(error.message || "Cập nhật thất bại!", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối server!", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={30} />
    </div>
  );

  return (
    <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 text-white">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-8 gap-6">
        <div>
          <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter leading-none">
            {isEditing ? "Hiệu chỉnh hồ sơ" : "Thông tin cá nhân"}
          </h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2">
            ID: {userData?.userId || 'N/A'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 relative z-30">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-white text-black px-8 py-3.5 rounded-2xl font-black uppercase text-[11px] flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-xl"
            >
              <Edit3 size={15}/> Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="text-zinc-500 hover:text-white px-5 py-3 font-black uppercase text-[10px]">Hủy</button>
              <button 
                onClick={handleUpdate}
                disabled={updating}
                className="bg-red-600 text-white px-10 py-3.5 rounded-2xl font-black uppercase text-[11px] flex items-center gap-2 hover:bg-red-500 transition-all shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:opacity-50"
              >
                {updating ? <Loader2 size={15} className="animate-spin"/> : <Save size={15}/>}
                Lưu lại
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
        {!isEditing ? (
          <>
            <ViewField label="Họ và tên" value={`${userData?.firstName || ''} ${userData?.lastName || ''}`} icon={UserIcon} />
            <ViewField label="Email" value={userData?.email} icon={Mail} isLocked />
            <ViewField label="Số điện thoại" value={userData?.mobileNumber || "Chưa cập nhật"} icon={Phone} />
            <ViewField label="Ngày sinh" value={userData?.dateOfBirth ? new Date(formatToInputDate(userData.dateOfBirth)).toLocaleDateString('vi-VN') : "Chưa cập nhật"} icon={Calendar} />
            <ViewField label="Giới tính" value={userData?.gender === 'MALE' ? 'Nam' : userData?.gender === 'FEMALE' ? 'Nữ' : 'Khác'} icon={UserCircle} />
          </>
        ) : (
          <>
            <EditField label="Họ" name="firstName" value={formData.firstName} onChange={handleChange} icon={UserIcon} />
            <EditField label="Tên" name="lastName" value={formData.lastName} onChange={handleChange} icon={UserIcon} />
            <div className="opacity-40 pointer-events-none"><ViewField label="Email (Cố định)" value={userData?.email} icon={Mail} /></div>
            <EditField label="Số điện thoại" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} icon={Phone} />
            <EditField label="Ngày sinh" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} icon={Calendar} type="date" />
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Giới tính</label>
              <div className="relative">
                <UserCircle size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" />
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/10 p-5 pl-14 rounded-2xl text-sm text-white outline-none focus:border-red-600 appearance-none transition-all">
                  <option value="MALE" className="bg-zinc-950">Nam</option>
                  <option value="FEMALE" className="bg-zinc-950">Nữ</option>
                  <option value="OTHER" className="bg-zinc-950">Khác</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-12 right-12 z-[999] animate-in fade-in slide-in-from-right-10 duration-500">
          <div className={`flex items-center gap-5 px-8 py-5 rounded-[2rem] border shadow-2xl backdrop-blur-xl ${toast.type === 'success' ? 'bg-zinc-900/90 border-green-500/30 text-green-400' : 'bg-zinc-900/90 border-red-500/30 text-red-400'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <div>
              <p className="text-[9px] uppercase font-black tracking-[0.3em] opacity-40 leading-none mb-1.5">Thông báo hệ thống</p>
              <p className="text-sm font-bold text-white tracking-tight">{toast.msg}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function ViewField({ label, value, icon: Icon, isLocked = false }: any) {
  return (
    <div className="space-y-3 group">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700 ml-1 group-hover:text-zinc-500 transition-colors">{label}</label>
      <div className="flex items-center gap-5 p-5 bg-white/[0.01] border border-white/5 rounded-[1.5rem] transition-all group-hover:bg-white/[0.02]">
        <Icon size={18} className="text-zinc-800 group-hover:text-red-900 transition-colors" />
        <span className={`text-sm font-medium ${isLocked ? 'text-zinc-600 italic' : 'text-zinc-400'}`}>{value || "Chưa cập nhật"}</span>
      </div>
    </div>
  );
}

function EditField({ label, name, value, onChange, icon: Icon, type = "text" }: any) {
  return (
    <div className="space-y-3 animate-in zoom-in-95 duration-300">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600/80 ml-1">{label}</label>
      <div className="relative group">
        <Icon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-all" />
        <input type={type} name={name} value={value} onChange={onChange} className="w-full bg-white/[0.06] border border-white/10 p-5 pl-14 rounded-[1.5rem] text-sm text-white outline-none focus:border-red-600 focus:bg-white/[0.1] transition-all [color-scheme:dark]" />
      </div>
    </div>
  );
}