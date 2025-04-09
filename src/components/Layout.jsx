import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import Footer from "./footer/Footer";

const Layout = () => {
  return (
    <main className="App">
      <AppNavbar />
      <Outlet />
      <Footer />
    </main>
  );
};

export default Layout;
