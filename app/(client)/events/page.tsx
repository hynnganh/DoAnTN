"use client";
import React, { useState } from 'react';
import { Calendar, Tag, Gift, ChevronRight, Timer, Sparkles, Ticket } from 'lucide-react';

export default function EventsPage() {
  const [filter, setFilter] = useState('all');

  const events = [
    {
      id: 1,
      type: 'promotion',
      title: "Thứ Hai Vui Vẻ - Đồng giá 45K",
      desc: "Ưu đãi giá vé cực sốc dành cho tất cả các suất chiếu vào ngày Thứ Hai đầu tuần. Áp dụng cho mọi lứa tuổi tại tất cả cụm rạp.",
      date: "Mỗi Thứ 2 hàng tuần",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000",
      badge: "Best Seller",
      color: "from-red-600 to-orange-600"
    },
    {
      id: 2,
      type: 'event',
      title: "Fan Meeting: Kẻ Hủy Diệt",
      desc: "Giao lưu cùng đoàn làm phim, nhận poster có chữ ký và bộ quà tặng độc quyền từ nhà phát hành A&K.",
      date: "20/03/2026",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000",
      badge: "Exclusive",
      color: "from-blue-600 to-purple-600"
    },
    {
      id: 3,
      type: 'membership',
      title: "X3 Điểm Thưởng VIP",
      desc: "Cơ hội thăng hạng Platinum nhanh chóng khi đặt vé trực tuyến. Tích lũy điểm gấp 3 lần cho mọi giao dịch F&B.",
      date: "01/03 - 15/03/2026",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000",
      badge: "VIP Only",
      color: "from-yellow-500 to-red-600"
    },
    {
      id: 4,
      type: 'promotion',
      title: "Combo Bắp Nước Avatar Limited",
      desc: "Sở hữu ngay bình nước tạo hình nhân vật Neytiri phiên bản giới hạn khi mua Combo bắp nước bất kỳ.",
      date: "Đang diễn ra",
      image: "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?q=80&w=1000",
      badge: "Limited Edition",
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: 5,
      type: 'event',
      title: "Đêm Nhạc OST Movie Live",
      desc: "Thưởng thức các bản nhạc phim bất hủ được trình diễn bởi dàn nhạc giao hưởng ngay tại sảnh chờ rạp Thủ Đức.",
      date: "25/03/2026",
      image: "https://images.unsplash.com/photo-1514525253361-bee8718a300c?q=80&w=1000",
      badge: "Music Night",
      color: "from-pink-600 to-rose-600"
    },
    {
      id: 6,
      type: 'promotion',
      title: "ZaloPay - Hoàn tiền 50%",
      desc: "Thanh toán vé xem phim qua ZaloPay để nhận ngay voucher hoàn tiền lên đến 50.000đ cho lần đặt vé tiếp theo.",
      date: "Thứ 6 - Chủ Nhật",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1000",
      badge: "Banking Deal",
      color: "from-green-500 to-teal-600"
    },
    {
      id: 7,
      type: 'membership',
      title: "Quà Sinh Nhật Thành Viên",
      desc: "Nhận ngay 01 phần bắp ngọt và 02 ly nước miễn phí trong tuần lễ sinh nhật của bạn tại bất kỳ cụm rạp nào.",
      date: "Theo tháng sinh",
      image: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=1000",
      badge: "Birthday Gift",
      color: "from-indigo-500 to-purple-700"
    },
    {
      id: 8,
      type: 'event',
      title: "Workshop: Review Phim",
      desc: "Học cách viết review và phân tích kịch bản cùng các Critics hàng đầu Việt Nam. Cơ hội nhận thẻ quà tặng 1 năm xem phim.",
      date: "05/04/2026",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000",
      badge: "Workshop",
      color: "from-emerald-500 to-green-700"
    },
    {
      id: 9,
      type: 'promotion',
      title: "Gói 'Couple' - Tiết kiệm 30%",
      desc: "Trọn gói 02 vé ghế đôi Sweetbox và 01 combo bắp nước lớn chỉ với giá ưu đãi. Dành riêng cho các cặp đôi.",
      date: "Hằng ngày",
      image: "https://images.unsplash.com/photo-1543536448-d247542f576c?q=80&w=1000",
      badge: "For Couples",
      color: "from-fuchsia-600 to-pink-500"
    }
  ];

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden pt-10 pb-20">
      
      {/* --- BACKGROUND DECOR --- */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-red-600/5 blur-[150px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- DYNAMIC HEADER (Phần tiêu đề trang) --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="space-y-4 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-red-500">
              <Sparkles size={12} fill="currentColor" /> Khám phá ưu đãi
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.8] mb-2">
              Hot <br/> <span className="text-red-600">Events</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium max-w-sm border-l-2 border-red-600 pl-4 uppercase tracking-tighter">
              Nơi cập nhật những chương trình <br/> khuyến mãi và sự kiện điện ảnh mới nhất.
            </p>
          </div>

          {/* BỘ LỌC TỐI GIẢN (MINIMAL FILTER) */}
          <div className="flex flex-wrap gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/5 backdrop-blur-md animate-in fade-in slide-in-from-right duration-700">
            {[
              { id: 'all', label: 'Tất cả', icon: Ticket },
              { id: 'promotion', label: 'Deal hời', icon: Tag },
              { id: 'event', label: 'Sự kiện', icon: Calendar },
              { id: 'membership', label: 'Thành viên', icon: Gift },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${filter === t.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- MASONRY GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, idx) => (
            <div 
              key={event.id} 
              className="group relative bg-[#0a0a0a] rounded-[3rem] border border-white/5 overflow-hidden transition-all duration-700 hover:border-red-600/50 hover:shadow-[0_30px_60px_-15px_rgba(220,38,38,0.2)] animate-in fade-in zoom-in-95 duration-700"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {/* Image & Badge */}
              <div className="relative h-[400px] overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                
                {/* Floating Badge */}
                <div className={`absolute top-8 left-8 px-5 py-2 rounded-full bg-gradient-to-r ${event.color} text-[9px] font-black uppercase tracking-widest shadow-xl`}>
                  {event.badge}
                </div>
              </div>

              {/* Card Content Overlayed */}
              <div className="absolute bottom-0 left-0 w-full p-8 space-y-4">
                <div className="flex items-center gap-2 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">
                   <Timer size={12} /> {event.date}
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight group-hover:text-red-500 transition-colors">
                  {event.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {event.desc}
                </p>
                
                <div className="pt-4 overflow-hidden h-0 group-hover:h-16 transition-all duration-500">
                   <button className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all active:scale-95">
                      Khám phá ngay <ChevronRight size={14} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- LOAD MORE / EMPTY --- */}
        {filteredEvents.length > 0 && (
            <div className="mt-20 text-center">
                <button className="px-12 py-5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:border-red-600 hover:text-white transition-all">
                    Xem thêm sự kiện
                </button>
            </div>
        )}
      </div>

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}