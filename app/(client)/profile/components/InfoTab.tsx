import { User, Phone, Mail, MapPin } from 'lucide-react';

export default function InfoTab() {
  const fields = [
    { label: 'Họ và tên', value: 'Alex Nguyen', icon: User },
    { label: 'Số điện thoại', value: '0901 234 567', icon: Phone },
    { label: 'Email', value: 'alex.cinema@gmail.com', icon: Mail },
    { label: 'Rạp yêu thích', value: 'A&K Bitexco - Quận 1', icon: MapPin },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase italic">Thông tin cá nhân</h2>
        <button className="bg-white text-black px-6 py-2.5 rounded-full font-black uppercase text-[10px]">Cập nhật</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {fields.map((field, idx) => (
          <div key={idx} className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">{field.label}</label>
            <div className="relative">
              <field.icon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" />
              <input type="text" defaultValue={field.value} className="w-full bg-white/5 border border-white/10 p-4 pl-14 rounded-2xl text-sm text-zinc-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}