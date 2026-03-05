import Banner from "./(client)/components/home/Banner";
import MovieSection from "./(client)/components/home/MovieSection";
import EventSection from "./(client)/components/home/EventSection";
import TopBanner from "./(client)/components/TopBanner";
import TopMenu from "./(client)/components/TopMenu";
import Navbar from "./(client)/components/Navbar";
import Footer from "./(client)/components/Footer";
import CinematicUniverse from "./(client)/components/home/CinematicUniverse";

export default function Home() {
  return (
    <>
      <TopBanner />
      <TopMenu />
      <Navbar />
      <Banner />
      <MovieSection />
      <EventSection />
      <CinematicUniverse />
      <Footer />
    </>
  );
}