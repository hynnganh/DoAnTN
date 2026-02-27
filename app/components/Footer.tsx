export default function Footer() {
  return (
    <footer className="bg-gray-200 text-black mt-10">
      <div className="grid grid-cols-4 gap-10 px-10 py-10 text-sm">
        <div>
          <h4 className="font-bold mb-3">A&K Việt Nam</h4>
          <p>Giới thiệu</p>
          <p>Tuyển dụng</p>
          <p>Liên hệ</p>
        </div>

        <div>
          <h4 className="font-bold mb-3">Điều khoản</h4>
          <p>Điều khoản chung</p>
          <p>Chính sách bảo mật</p>
        </div>

        <div>
          <h4 className="font-bold mb-3">Kết nối</h4>
          <p>Facebook</p>
          <p>Instagram</p>
        </div>

        <div>
          <h4 className="font-bold mb-3">Chăm sóc khách hàng</h4>
          <p>Hotline: 1900 6017</p>
          <p>Email: support@cinema.com</p>
        </div>
      </div>

      <div className="text-center py-4 bg-gray-300 text-xs">
        © 2026 Next Cinema. All rights reserved.
      </div>
    </footer>
  );
}