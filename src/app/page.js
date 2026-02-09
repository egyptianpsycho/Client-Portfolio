import About from "@/Components/About/About";
import BTL from "@/Components/BehindTheLens/BTL";
import Contact from "@/Components/Contact/Contact";
import Hero from "@/Components/Hero/Hero";
import Partners from "@/Components/Partners/Partners";
import Projects from "@/Components/Projects/Projects";
import Recent from "@/Components/Recent/Recent";
import { Testimonials } from "@/Components/Testimonials/Testimonials";
import Chat from "@/Components/Chat/Chat";
import Footer from "@/Components/UI/Footer";

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <Partners />
      <Recent />
      <Projects />
      <Testimonials />
      <BTL />
      <Chat />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
