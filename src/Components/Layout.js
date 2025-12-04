import SmoothScroll from "./SmoothScroll";
import Header from "./UI/Header";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <SmoothScroll>
        <div id="page-wrapper">
          <main>{children}</main>
        </div>
      </SmoothScroll>
    </div>
  );
};

export default Layout;
