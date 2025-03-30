import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import Home from "./pages/home/Home";
import UserMaterial from "./pages/UserMaterial";
import Material from "./pages/Material";
import AddItem from "./pages/AddItem";
import UpdateItem from "./pages/UpdateItem";
import Cocktails from "./pages/cocktails/Cocktails";
import AddCocktail from "./pages/AddCocktail";
import UpdateCocktail from "./pages/UpdateCocktail";
import Cocktail from "./pages/Cocktail";
import Charts from "./pages/charts/Charts";
import Layout from "./components/Layout";
import Missing from "./components/Missing";

import "bootstrap/dist/css/bootstrap.min.css";
// import Header from "./components/Header";
// import UserNavbar from "./components/userNavbar/UserNavbar";
// import Footer from "./components/footer/Footer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* <AuthProvider>
          <Header />
          <PrivateRoute component={HomePage} path="/" exact />
          <Route component={LoginPage} path="/login" />
        </AuthProvider> */}
        <Route element={<LoginPage />} path="/Login" />
        <Route path="/Charts" element={<Charts />} />
        <Route path="/" element={<Home />} exact />
        <Route path="/UserMaterial/:id" element={<UserMaterial />} />
        <Route path="/Cocktail/:id" element={<Cocktail />} />
        <Route element={<PrivateRoute />}>
          <Route element={<HomePage />} path="/Home" />
          <Route path="/Material/:id" element={<Material />} />
          <Route path="/AddItem/:id" element={<AddItem />} />
          <Route path="/UpdateItem/:id/:id" element={<UpdateItem />} />
          <Route path="/Cocktails" element={<Cocktails />} />
          <Route path="/AddCocktail" element={<AddCocktail />} />
          <Route path="/UpdateCocktail/:id" element={<UpdateCocktail />} />
        </Route>
        <Route path="*" element={<Missing />} />
      </Route>
      {/* <Footer /> */}
    </Routes>
  );
}

export default App;
