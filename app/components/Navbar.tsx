import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-10 py-4 bg-white border-b">
      <h1 className="text-3xl font-bold text-red-600">
        CGV
      </h1>

      <nav className="flex gap-10 font-semibold text-black">
        <Link href="#">PHIM</Link>
        <Link href="#">RẠP CGV</Link>
        <Link href="#">THÀNH VIÊN</Link>
        <Link href="#">CULTUREPLEX</Link>
      </nav>

      <button className="bg-red-600 text-white px-4 py-2 rounded">
        MUA VÉ NGAY
      </button>
    </div>
  );
}