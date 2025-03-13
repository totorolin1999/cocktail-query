import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import Home from "./pages/home/Home";
import UserBases from "./pages/UserBases";
import UserLiqueurs from "./pages/UserLiqueurs";
import UserAlcohols from "./pages/UserAlcohols";
import UserIngredients from "./pages/UserIngredients";
import Bases from "./pages/Bases";
import AddBase from "./pages/AddBase";
import UpdateBase from "./pages/UpdateBase";
import Liqueurs from "./pages/Liqueurs";
import AddLiqueur from "./pages/AddLiqueur";
import UpdateLiqueur from "./pages/UpdateLiqueur";
import Alcohols from "./pages/Alcohols";
import AddAlcohol from "./pages/AddAlcohol";
import UpdateAlcohol from "./pages/UpdateAlcohol";
import Ingredients from "./pages/Ingredients";
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
        <Route path="/UserBases" element={<UserBases />} />
        <Route path="/UserLiqueurs" element={<UserLiqueurs />} />
        <Route path="/UserAlcohols" element={<UserAlcohols />} />
        <Route path="/UserIngredients" element={<UserIngredients />} />
        <Route path="/Cocktail/:id" element={<Cocktail />} />
        <Route element={<PrivateRoute />}>
          <Route element={<HomePage />} path="/Home" />
          <Route path="/Bases" element={<Bases />} />
          <Route path="/AddBase" element={<AddBase />} />
          <Route path="/UpdateBase/:id" element={<UpdateBase />} />
          <Route path="/Liqueurs" element={<Liqueurs />} />
          <Route path="/AddLiqueur" element={<AddLiqueur />} />
          <Route path="/UpdateLiqueur/:id" element={<UpdateLiqueur />} />
          <Route path="/Alcohols" element={<Alcohols />} />
          <Route path="/AddAlcohol" element={<AddAlcohol />} />
          <Route path="/UpdateAlcohol/:id" element={<UpdateAlcohol />} />
          <Route path="/Ingredients" element={<Ingredients />} />
          <Route path="/AddIngredient" element={<AddIngredient />} />
          <Route path="/UpdateIngredient/:id" element={<UpdateIngredient />} />
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
