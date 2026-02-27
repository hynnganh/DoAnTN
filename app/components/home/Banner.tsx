export default function Banner() {
  return (
    <div className="w-full h-[450px] bg-gradient-to-r from-black to-gray-800 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">
          🎬 NEXT CINEMA
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Đặt vé xem phim nhanh chóng - tiện lợi - hiện đại
        </p>
        <button className="bg-red-600 px-6 py-3 rounded text-white hover:bg-red-700 transition">
          Mua Vé Ngay
        </button>
      </div>
    </div>
  );
}