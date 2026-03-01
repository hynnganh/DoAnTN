import { Ticket, Shield, Star } from 'lucide-react';

export default function StatsHeader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
      {/* Points Card */}
      <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Điểm tích lũy</p>
          <h4 className="text-4xl font-black text-red-600 italic">1.250</h4>
        </div>
        <Ticket className="absolute -right-4 top-1/2 -translate-y-1/2 text-white/5 w-24 h-24 -rotate-12 group-hover:scale-110 transition-transform duration-500" />
      </div>

      {/* Movies Card */}
      <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Vé đã xem</p>
          <h4 className="text-4xl font-black text-white italic">24</h4>
        </div>
        <Shield className="absolute -right-4 top-1/2 -translate-y-1/2 text-white/5 w-24 h-24 rotate-12 group-hover:scale-110 transition-transform duration-500" />
      </div>

      {/* VIP Rank Card */}
      <div className="bg-red-600 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-red-600/20">
        <div className="relative z-10">
          <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-1">Hạng thành viên</p>
          <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase">Platinum</h4>
        </div>
        <Star className="absolute -right-4 top-1/2 -translate-y-1/2 text-white/10 w-24 h-24 rotate-12" fill="currentColor" />
      </div>
    </div>
  );
}