import { Heart, Play } from 'lucide-react';

const wishlistData = [
  { id: 1, title: 'Inception', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500' },
  { id: 2, title: 'Interstellar', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500' },
  { id: 3, title: 'The Dark Knight', img: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=500' },
  { id: 4, title: 'Dunkirk', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500' },
];

export default function WishlistTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Phim yêu thích</h2>
        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">4 Phim</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {wishlistData.map((movie) => (
          <div key={movie.id} className="group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 border border-white/5 group-hover:border-red-600/50 transition-all">
              <img 
                src={movie.img} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100" 
                alt={movie.title} 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                  <Play size={20} fill="currentColor" className="ml-1" />
                </div>
              </div>
              <button className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-xl text-red-500 hover:scale-110 transition-transform">
                <Heart size={14} fill="currentColor" />
              </button>
            </div>
            <h5 className="text-[11px] font-black uppercase tracking-tight group-hover:text-red-500 transition-colors italic leading-tight">
              {movie.title}
            </h5>
          </div>
        ))}
      </div>
    </div>
  );
}