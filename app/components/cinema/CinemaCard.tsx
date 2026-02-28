const CinemaCard = ({ cinema, isActive, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-[2.2rem] cursor-pointer transition-all duration-500 ${
      isActive ? 'bg-red-600 shadow-2xl' : 'hover:bg-white/5 border border-transparent hover:border-white/10'
    }`}
  >
    <h3 className="text-lg font-black uppercase tracking-tight">{cinema.name}</h3>
    <p className={`text-[10px] font-bold mt-1 ${isActive ? 'text-red-100' : 'text-gray-500'}`}>
      {cinema.address}
    </p>
  </div>
);