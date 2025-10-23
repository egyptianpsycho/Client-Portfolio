import About from "@/Components/About";
import BTL from "@/Components/BehindTheLens/BTL";
import Hero from "@/Components/Hero";
import Partners from "@/Components/Partners";
import Main from "@/Components/Projects/Main";
import ServicesMain from "@/Components/Services/ServicesMain";
import Signature from "@/Components/Signature";
import SmoothScroll from "@/Components/SmoothScroll";

const Home = () => {
  return (
    <SmoothScroll>
      <div id="page-wrapper">
        <Hero />
        <About />
        <Partners />
        <BTL />
        <Main />
        <ServicesMain />
      </div>
    </SmoothScroll>
  );
};

export default Home;
