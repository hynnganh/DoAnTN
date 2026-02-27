export default function EventSection() {
  return (
    <div className="px-12 py-16 bg-white">
      <h2 className="text-3xl font-bold mb-10 text-black">
        🎉 Sự Kiện & Ưu Đãi
      </h2>

      <div className="grid grid-cols-3 gap-8">
        <div className="bg-red-500 text-white p-8 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-3">
            Thứ 4 Vui Vẻ
          </h3>
          <p>Giá vé chỉ từ 50.000đ</p>
        </div>

        <div className="bg-yellow-500 text-white p-8 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-3">
            Thành Viên Giảm Giá
          </h3>
          <p>Giảm 10% cho hội viên</p>
        </div>

        <div className="bg-blue-500 text-white p-8 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-3">
            Combo Siêu Tiết Kiệm
          </h3>
          <p>Bắp + Nước giá ưu đãi</p>
        </div>
      </div>
    </div>
  );
}