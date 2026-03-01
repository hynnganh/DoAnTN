import { User, Ticket, CreditCard, Heart, Settings, LogOut, Camera } from 'lucide-react';

const menuItems = [
  { id: 'info', label: 'Tài khoản', icon: User },
  { id: 'tickets', label: 'Lịch sử vé', icon: Ticket },
  { id: 'payment', label: 'Thanh toán', icon: CreditCard },
  { id: 'wishlist', label: 'Yêu thích', icon: Heart },
  { id: 'settings', label: 'Bảo mật', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }: any) {
  return (
    <aside className="w-full lg:w-80 bg-[#080808] border-r border-white/5 p-8 flex flex-col shrink-0 z-20">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-12">
        A<span className="text-red-600">&</span>K <span className="text-lg not-italic font-bold text-zinc-400">Cinema</span>
      </h1>

      <div className="mb-10 text-center lg:text-left">
        <div className="relative w-24 h-24 mx-auto lg:mx-0 mb-4 group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000" className="w-full h-full object-cover rounded-[2rem] border-2 border-red-600/30 p-1" alt="Avatar" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-[2rem] transition-all"><Camera size={20} /></div>
        </div>
        <h3 className="text-xl font-black uppercase tracking-tight italic">Alex Nguyen</h3>
        <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">Platinum Member</p>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
          >
            <item.icon size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="mt-10 flex items-center gap-4 px-5 py-4 text-zinc-600 hover:text-red-500 transition-colors border-t border-white/5 pt-10 uppercase text-[11px] font-black">
        <LogOut size={18} /> Thoát
      </button>
    </aside>
  );
}