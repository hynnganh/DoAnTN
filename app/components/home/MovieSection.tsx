import MovieCard from "./MovieCard";

const movies = [
  {
    id: 1,
    title: "Avengers: Endgame",
    image: "/movie1.jpg",
  },
  {
    id: 2,
    title: "Spider-Man: No Way Home",
    image: "/movie2.jpg",
  },
  {
    id: 3,
    title: "Oppenheimer",
    image: "/movie3.jpg",
  },
  {
    id: 4,
    title: "Dune: Part Two",
    image: "/movie4.jpg",
  },
];

export default function MovieSection() {
  return (
    <div className="px-12 py-16 bg-gray-100">
      <h2 className="text-3xl font-bold mb-10 text-black">
        🎥 Phim Đang Chiếu
      </h2>

      <div className="grid grid-cols-4 gap-8">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            image={movie.image}
          />
        ))}
      </div>
    </div>
  );
}