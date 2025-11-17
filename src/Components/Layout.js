import Header from "./UI/Header";
// import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
