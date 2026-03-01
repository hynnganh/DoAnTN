import Image from "next/image";
import Link from "next/link";
import { Ticket, Star } from "lucide-react"; // Nếu bạn dùng lucide-react, không thì bỏ qua nhé

interface MovieCardProps {
  id: number;
  title: string;
  image: string;
  rating?: string; // Thêm rating cho chuyên nghiệp
}

export default function MovieCard({ id, title, image, rating = "8.5" }: MovieCardProps) {
  return (
    <div className="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-red-500/20 hover:-translate-y-2 border border-white/5">
      
      {/* Container Ảnh */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={300}
          height={450}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Lớp phủ Gradient khi Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-black/20 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge Rating - Góc trên bên trái */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-yellow-500/50">
          <Star size={14} className="fill-yellow-500 text-yellow-500" />
          <span className="text-white text-xs font-bold">{rating}</span>
        </div>

        {/* Nút "Mua Vé" hiện lên khi Hover (Dạng Overlay) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Link href={`/movies/${id}`}>
            <button className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-full font-bold shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:bg-red-700 transition-colors uppercase text-sm">
              <Ticket size={18} />
              Mua Vé Ngay
            </button>
          </Link>
        </div>
      </div>

      {/* Phần thông tin phía dưới */}
      <div className="p-4 relative">
        <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-red-500 transition-colors duration-300">
          {title}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-400 text-xs uppercase tracking-wider font-medium">Hành Động • 2D/3D</span>
          <span className="text-red-500 text-xs font-bold border border-red-500/50 px-1.5 py-0.5 rounded">T18</span>
        </div>

        {/* Đường line hiệu ứng khi hover */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-500 group-hover:w-full" />
      </div>
    </div>
  );
}