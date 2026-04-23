import SmoothScroll from "./SmoothScroll";
import Header from "./UI/Header";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <SmoothScroll>
          <main>{children}</main>
      </SmoothScroll>
    </div>
  );
};

export default Layout;
