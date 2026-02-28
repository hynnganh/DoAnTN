const MovieCard = ({ movie, onTimeSelect }: any) => (
  <div className="flex flex-col md:flex-row gap-10 group animate-in fade-in slide-in-from-bottom-6 duration-700">
    <img src={movie.image} className="w-36 aspect-[2/3] rounded-[2rem] object-cover shadow-2xl" alt="" />
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-3">
        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded">{movie.tag}</span>
        <h4 className="text-3xl font-black uppercase tracking-tight">{movie.title}</h4>
      </div>
      {movie.formats.map((f: any, idx: number) => (
        <div key={idx} className="space-y-4">
          <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase italic">● {f.type}</p>
          <div className="flex flex-wrap gap-3">
            {f.times.map((time: string) => (
              <button 
                key={time}
                onClick={() => onTimeSelect(movie, time, f.type)}
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 font-black hover:bg-red-600 hover:scale-110 transition-all"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);