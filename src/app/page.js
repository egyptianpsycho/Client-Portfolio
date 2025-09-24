import About from "@/Components/About";
import Hero from "@/Components/Hero";
import Signature from "@/Components/Signature";
import SmoothScroll from "@/Components/SmoothScroll";

const Home = () => {
  return (
    <SmoothScroll>
      <div id="page-wrapper">
        <Hero />
        <About />
      </div>
    </SmoothScroll>
  );
};

export default Home;

{
  /* <div className=" h-screen bg-gradient-to-tr from-[#000000] to-[#434343] z-[-1000]"> */
}
