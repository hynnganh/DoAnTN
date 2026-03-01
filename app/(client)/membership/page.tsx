"use client";
import React from 'react';
import { Star, Gift, Zap, Info, CheckCircle2, AlertCircle, ChevronLeft, Award, Crown } from 'lucide-react';
import Link from 'next/link';

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600/30">
      {/* --- HERO SECTION --- */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-600/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 animate-bounce">
            <Award size={14} /> Đặc quyền thành viên
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
            Nâng tầm <br/> <span className="text-red-600">Trải nghiệm</span>
          </h1>
          <p className="text-zinc-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Chương trình khách hàng thân thiết A&K Rewards mang đến cho bạn những ưu đãi tích điểm hấp dẫn, quà tặng sinh nhật và những suất chiếu sớm đặc biệt.
          </p>
        </div>
      </section>

      {/* --- BẢNG ĐIỂM THƯỞNG (REWARD TABLE) --- */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="p-10 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Hạng mức & Quyền lợi</th>
                  <th className="p-10 text-center">
                    <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-widest text-zinc-400">Member</p>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase italic">U22 / Thân thiết</p>
                    </div>
                  </th>
                  <th className="p-10 text-center border-x border-white/5 bg-red-600/5">
                    <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-widest text-red-600">VIP</p>
                      <p className="text-[9px] font-bold text-red-900 uppercase italic">Elite Member</p>
                    </div>
                  </th>
                  <th className="p-10 text-center">
                    <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-widest text-yellow-500 flex items-center justify-center gap-1">
                        <Crown size={14} fill="currentColor"/> VVIP
                      </p>
                      <p className="text-[9px] font-bold text-yellow-900 uppercase italic">Premium Plus</p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { label: "Tích lũy vé xem phim", desc: "Trên mỗi 100.000 VNĐ", v1: "5% (5đ)", v2: "7% (7đ)", v3: "10% (10đ)", color: "red" },
                  { label: "Tích lũy Bắp & Nước", desc: "Trên mỗi 100.000 VNĐ", v1: "3% (3đ)", v2: "4% (4đ)", v3: "5% (5đ)", color: "zinc" },
                  { label: "Quà tặng sinh nhật", desc: "Tháng sinh nhật", v1: "Voucher 50%", v2: "Combo 1 Miễn phí", v3: "Combo 2 Miễn phí", color: "zinc" },
                  { label: "Đổi điểm vé 2D", desc: "Số điểm cần thiết", v1: "90 Điểm", v2: "80 Điểm", v3: "70 Điểm", color: "zinc" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-10">
                      <h4 className="font-black uppercase italic tracking-tight text-white group-hover:text-red-500 transition-colors">{row.label}</h4>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase">{row.desc}</p>
                    </td>
                    <td className="p-10 text-center text-sm font-bold text-zinc-500">{row.v1}</td>
                    <td className="p-10 text-center text-sm font-black text-red-600 bg-red-600/5 border-x border-white/5">{row.v2}</td>
                    <td className="p-10 text-center text-sm font-bold text-yellow-500">{row.v3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- ĐIỀU KHOẢN & CHI TIẾT --- */}
      <section className="bg-zinc-900/30 py-24 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
             <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
                <Zap size={24} fill="currentColor"/>
             </div>
             <h3 className="text-xl font-black uppercase italic italic">Tích lũy & Quy đổi</h3>
             <p className="text-zinc-500 text-sm leading-relaxed">
               Mỗi 1 điểm tương đương 1.000 VNĐ. Bạn có thể sử dụng điểm để thanh toán trực tiếp cho bất kỳ giao dịch nào tại rạp hoặc trên ứng dụng.
             </p>
          </div>
          <div className="space-y-4">
             <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center border border-white/10">
                <Gift size={24} />
             </div>
             <h3 className="text-xl font-black uppercase italic italic">Duy trì hạng thẻ</h3>
             <p className="text-zinc-500 text-sm leading-relaxed">
               Hạng mức thành viên được xét duyệt dựa trên tổng chi tiêu trong vòng 12 tháng. Điểm thưởng có thời hạn sử dụng 1 năm kể từ ngày tích lũy.
             </p>
          </div>
          <div className="space-y-4">
             <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center border border-white/10">
                <Info size={24} />
             </div>
             <h3 className="text-xl font-black uppercase italic italic">Lưu ý chung</h3>
             <p className="text-zinc-500 text-sm leading-relaxed">
               Vui lòng xuất trình mã thành viên trước khi thanh toán. Không áp dụng tích điểm đồng thời với các chương trình khuyến mãi đối tác khác.
             </p>
          </div>
        </div>
      </section>

      {/* --- LIST LƯU Ý --- */}
      <section className="max-w-4xl mx-auto px-6 py-24 space-y-12">
        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-red-600 text-center">Các điều khoản bổ sung</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          {[
            "Điểm thưởng tối thiểu để sử dụng là 10 điểm.",
            "Điểm không có giá trị quy đổi ra tiền mặt.",
            "Tối đa tích điểm cho 10 giao dịch/ngày.",
            "Hệ thống sẽ cập nhật điểm sau 24h giao dịch.",
            "Thành viên VVIP được ưu tiên xếp hàng tại quầy.",
            "Mất thẻ vật lý sẽ chịu phí cấp lại 50.000 VNĐ."
          ].map((text, i) => (
            <div key={i} className="flex gap-4 items-start group">
              <CheckCircle2 size={16} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-xs text-zinc-500 font-bold uppercase leading-relaxed group-hover:text-white transition-colors italic">{text}</p>
            </div>
          ))}
        </div>
        
        <div className="p-8 rounded-[2rem] bg-yellow-500/5 border border-yellow-500/10 flex items-center gap-6">
          <AlertCircle className="text-yellow-600 shrink-0" size={24} />
          <p className="text-[10px] text-yellow-600/80 font-black uppercase tracking-widest leading-loose">
            A&K Cinema bảo lưu quyền thay đổi các điều khoản và điều kiện của chương trình khách hàng thân thiết bất kỳ lúc nào mà không cần thông báo trước.
          </p>
        </div>
      </section>
    </div>
  );
}