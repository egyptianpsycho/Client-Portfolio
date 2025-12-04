import BTL from "@/Components/AboutBehind/BTL";
import SmoothScroll from "@/Components/SmoothScroll";
import Footer from "@/Components/UI/Footer";
import Header from "@/Components/UI/Header";

const Home = () => {
  return (
      <div>
        <BTL />
        <div className="absolute bottom-[-160%] w-full">
        <Footer />
        </div>
      </div>
  );
};

export default Home;
