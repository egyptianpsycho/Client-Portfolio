import Images from "./PhotoSessions/Images";
import Videos from "./VideoSessions/Videos";

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
