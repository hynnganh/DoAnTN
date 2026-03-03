import MovieForm from "../../MovieForm";

export default function Page({ params }: { params: { id: string } }) {
  // Thực tế: const movie = await getMovieFromDB(params.id);
  const mockData = { id: params.id, title: 'Dune: Part Two', director: 'Denis Villeneuve', duration: 166 };

  return <MovieForm type="edit" initialData={mockData} />;
}