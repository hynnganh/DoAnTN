import { CreditCard, Plus, Star, ShieldCheck, Trash2, ArrowRight } from 'lucide-react';

export default function PaymentTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Phương thức thanh toán</h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
           <ShieldCheck size={14} className="text-green-500" />
           <span className="text-[9px] font-black uppercase tracking-widest text-green-500">Bảo mật SSL 256-bit</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* THẺ THÀNH VIÊN PLATINUM (VIRTUAL CARD) */}
        <div className="relative group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4 ml-1">Thẻ thành viên của bạn</p>
          <div className="relative aspect-[1.6/1] bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(220,38,38,0.3)] overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
            {/* Họa tiết trang trí trên thẻ */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-2xl" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="italic font-black text-xl tracking-tighter">
                  A<span className="text-black">&</span>K <span className="text-sm not-italic opacity-80">Cinema</span>
                </div>
                <Star className="text-white/40" fill="currentColor" size={24} />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Membership Number</p>
                <p className="text-xl md:text-2xl font-mono tracking-[0.2em]">8888 • 9999 • 2026</p>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-black uppercase opacity-60">Card Holder</p>
                  <p className="text-sm font-bold uppercase tracking-widest">Alex Nguyen</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase opacity-60">Valid Thru</p>
                  <p className="text-sm font-bold">12/28</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* THẺ NGÂN HÀNG ĐÃ LIÊN KẾT */}
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-0 ml-1">Thẻ ngân hàng liên kết</p>
          
          {/* Item Thẻ Visa */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between group hover:border-white/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-red-600/30 transition-all">
                <img src="https://www.svgrepo.com/show/354512/visa.svg" className="w-8" alt="Visa" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight">Visa Classic</p>
                <p className="text-xs text-zinc-500 font-mono">**** 4421</p>
              </div>
            </div>
            <button className="p-2 text-zinc-700 hover:text-red-500 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>

          {/* Nút thêm thẻ mới */}
          <button className="flex-1 border-2 border-dashed border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 hover:border-red-600/40 hover:bg-red-600/5 transition-all group">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 transition-all">
              <Plus size={20} className="text-zinc-500 group-hover:text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-300">Thêm phương thức mới</span>
          </button>
        </div>

      </div>

      {/* FOOTER: VÍ ĐIỆN TỬ */}
      <div className="pt-8 border-t border-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 italic">Ví điện tử</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Momo', 'ZaloPay', 'ShopeePay', 'Apple Pay'].map((wallet) => (
            <button key={wallet} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-red-600/30 hover:bg-white/10 transition-all text-[11px] font-bold text-zinc-400 hover:text-white flex items-center justify-between group">
              {wallet}
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}