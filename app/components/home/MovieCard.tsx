import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  id: number;
  title: string;
  image: string;
}

export default function MovieCard({ id, title, image }: MovieCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:scale-105 transition overflow-hidden">
      <Image
        src={image}
        alt={title}
        width={300}
        height={400}
        className="w-full h-[350px] object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold text-black mb-3">
          {title}
        </h3>

        <Link href={`/movies/${id}`}>
          <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
            Mua Vé
          </button>
        </Link>
      </div>
    </div>
  );
}