import About from "@/Components/About/About";
import BTL from "@/Components/BehindTheLens/BTL";
import Contact from "@/Components/Contact/Contact";
import Hero from "@/Components/Hero/Hero";
import Partners from "@/Components/Partners/Partners";
import Intro from "@/Components/Preloader/Intro";
import Projects from "@/Components/Projects/Projects";
import Recent from "@/Components/Recent/Recent";
import ServicesMain from "@/Components/Services/ServicesMain";
import Signature from "@/Components/Signature";
import SmoothScroll from "@/Components/SmoothScroll";
import { Testimonials } from "@/Components/Testimonials/Testimonials";

const Home = () => {
  return (
    <SmoothScroll>
      <div id="page-wrapper">
        <Hero />
        <About />
        <Partners />
        <BTL />
        <Recent />
        <Projects />
        <ServicesMain />
        <Testimonials />
        <Contact />
      </div>
    </SmoothScroll>
  );
};

export default Home;
