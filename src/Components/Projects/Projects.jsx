import Images from "./PhotoSessions/Images";
import Videos from "./VideoSessions/Videos";

const Projects = () => {
  return (
    <section
      className="relative min-h-screen  p-20 grain-overlay bg-gradient-to-b from-[#101010] to-black  "
      id="Projects"
    >
      <Images />
      <Videos />
      
    </section>
  );
};

export default Projects;
