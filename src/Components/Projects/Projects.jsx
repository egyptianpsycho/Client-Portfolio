import Images from "./PhotoSessions/Images";
import Videos from "./VideoSessions/Videos";

const Projects = () => {
  return (
    <section
      className="relative min-h-screen  p-20 grain-overlay  "
      id="Projects"
    >
      <Images />
      <Videos />
      
    </section>
  );
};

export default Projects;
