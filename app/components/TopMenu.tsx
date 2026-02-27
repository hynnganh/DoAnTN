import Link from "next/link";

export default function TopMenu() {
  return (
    <div className="flex justify-end gap-6 px-10 py-2 bg-gray-100 text-black text-sm">
      <Link href="#">Tin mới & Ưu đãi</Link>
      <Link href="#">Vé của tôi</Link>
      <Link href="#">Đăng nhập / Đăng ký</Link>
    </div>
  );
}