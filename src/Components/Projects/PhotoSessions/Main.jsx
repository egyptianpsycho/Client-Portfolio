import Images from "./Images";
import Videos from "./Videos";

const Main = () => {
  return (
    <section
      className="relative min-h-screen  p-20 grain-overlay "
      id="Projects"
    >
      {/* Images */}
      <Images />
      {/* Video */}
      <Videos />
      
    </section>
  );
};

export default Main;
