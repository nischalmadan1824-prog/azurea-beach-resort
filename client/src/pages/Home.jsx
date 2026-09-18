import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BookingSearch from "../components/BookingSearch";
import About from "../components/About";
import FeaturedRooms from "../components/FeaturedRooms";
import Experiences from "../components/Experiences";
import Dining from "../components/Dining";
import BookingCTA from "../components/BookingCTA";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <BookingSearch />
      <About />
      <FeaturedRooms />
      <Experiences />
      <Dining />
      <BookingCTA />
      <Footer />
    </>
  );
};

export default Home;