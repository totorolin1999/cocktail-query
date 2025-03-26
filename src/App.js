import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import Home from "./pages/home/Home";
import UserMaterial from "./pages/UserMaterial";
import Material from "./pages/Material";
import AddBase from "./pages/AddBase";
import UpdateBase from "./pages/UpdateBase";
import AddLiqueur from "./pages/AddLiqueur";
import UpdateLiqueur from "./pages/UpdateLiqueur";
import AddAlcohol from "./pages/AddAlcohol";
import UpdateAlcohol from "./pages/UpdateAlcohol";
import AddIngredient from "./pages/AddIngredient";
import UpdateIngredient from "./pages/UpdateIngredient";
import Cocktails from "./pages/cocktails/Cocktails";
import AddCocktail from "./pages/AddCocktail";
import UpdateCocktail from "./pages/UpdateCocktail";
import Cocktail from "./pages/Cocktail";
import Charts from "./pages/charts/Charts";
import Layout from "./components/Layout";
import Missing from "./components/Missing";
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
          <Route path="/Addbase" element={<AddBase />} />
          <Route path="/Addliqueur" element={<AddLiqueur />} />
          <Route path="/Addalcohol" element={<AddAlcohol />} />
          <Route path="/Addingredient" element={<AddIngredient />} />
          <Route path="/Updatebase/:id" element={<UpdateBase />} />
          <Route path="/Updateliqueur/:id" element={<UpdateLiqueur />} />
          <Route path="/Updatealcohol/:id" element={<UpdateAlcohol />} />
          <Route path="/Updateingredient/:id" element={<UpdateIngredient />} />
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
