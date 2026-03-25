"use client";
import React, { useEffect, useState } from 'react';
import { User as UserIcon, Phone, Mail, Loader2, Calendar, UserCircle } from 'lucide-react';

export default function InfoTab() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (res.ok) {
          const result = await res.json();
          // Nếu Backend trả về { data: { userId: 1, ... } } thì lấy result.data
          // Nếu Backend trả về { data: { user: { ... } } } thì lấy result.data.user
          const rawData = result.data?.user || result.data || result;
          console.log("Dữ liệu nhận được:", rawData);
          setUserData(rawData);
        }
      } catch (err) {
        console.error("Lỗi fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- HÀM FIX NGÀY SINH ---
  const getBirthDate = () => {
    // Thử tìm trong cả 2 trường hợp tên biến
    const dob = userData?.dateOfBirth || userData?.date_of_birth;
    if (!dob) return "Chưa cập nhật";

    // Trường hợp 1: BE trả về mảng [2005, 12, 22]
    if (Array.isArray(dob) && dob.length >= 3) {
      const [year, month, day] = dob;
      return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    }

    // Trường hợp 2: BE trả về chuỗi "2005-12-22"
    const dateObj = new Date(dob);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString('vi-VN');
    }

    return String(dob);
  };

  const getGender = () => {
    const gender = userData?.gender;
    if (!gender) return "Chưa cập nhật";
    
    const g = String(gender).toUpperCase();
    if (g === 'MALE' || g === 'NAM') return "Nam";
    if (g === 'FEMALE' || g === 'NU' || g === 'NỮ') return "Nữ";
    return gender;
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={30} />
    </div>
  );

  const fields = [
    { label: 'Họ và tên', value: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || '...', icon: UserIcon },
    { label: 'Email', value: userData?.email || '...', icon: Mail },
    { label: 'Số điện thoại', value: userData?.mobileNumber || '...', icon: Phone },
    { label: 'Ngày sinh', value: getBirthDate(), icon: Calendar },
    { label: 'Giới tính', value: getGender(), icon: UserCircle },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-[1000] uppercase italic text-white tracking-tighter">Thông tin cá nhân</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">
            ID: #{userData?.userId || 'N/A'}
          </p>
        </div>
        <button className="bg-white text-black px-8 py-3 rounded-full font-black uppercase text-[10px] hover:bg-red-600 transition-all active:scale-95">
          Cập nhật
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {fields.map((field, idx) => (
          <div key={idx} className="space-y-3 group">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">{field.label}</label>
            <div className="relative">
              <field.icon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" />
              <div className="w-full bg-white/[0.02] border border-white/5 p-5 pl-14 rounded-2xl text-sm text-zinc-300 font-medium">
                {field.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}