import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <main className="App app-layout">
      <AppNavbar />
      <div className="app-content">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
