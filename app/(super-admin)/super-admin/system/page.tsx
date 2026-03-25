"use client";
import React from 'react';
import { ShieldAlert, UserCheck, Key, Lock } from 'lucide-react';

export default function BigAdminSystemPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="p-10 bg-red-600/5 border border-red-600/10 rounded-[3rem] relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-[1000] italic uppercase tracking-tighter text-red-500">Cấu hình Hệ thống</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 max-w-md">
            Khu vực hạn chế dành cho Big Admin. Quản lý phân quyền, bảo mật và các tham số vận hành cốt lõi.
          </p>
        </div>
        <ShieldAlert size={120} className="absolute -right-4 -bottom-4 text-red-600/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-white px-2">Danh sách Nhân sự Quản trị</h3>
            <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-zinc-500 font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-5">Tài khoản</th>
                            <th className="px-8 py-5">Chức vụ</th>
                            <th className="px-8 py-5 text-right">Truy cập</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {['Quản lý Phim', 'Quản lý Rạp', 'Kế toán'].map((role, i) => (
                            <tr key={i} className="hover:bg-white/[0.01]">
                                <td className="px-8 py-5">
                                    <p className="font-bold text-white">staff_0{i}@akcinema.vn</p>
                                    <p className="text-[9px] text-zinc-600 uppercase font-black">Active 12m ago</p>
                                </td>
                                <td className="px-8 py-5"><span className="text-red-500 font-black uppercase tracking-tighter italic">{role}</span></td>
                                <td className="px-8 py-5 text-right"><button className="text-zinc-500 hover:text-white"><Lock size={14}/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-white px-2">Nhóm quyền (Roles)</h3>
            <div className="space-y-4">
                {['Super Admin', 'Branch Manager', 'Ticketing Staff'].map((name, i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Key size={16} className="text-yellow-600" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300">{name}</span>
                        </div>
                        <UserCheck size={16} className="text-zinc-600 group-hover:text-green-500 transition-colors" />
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}