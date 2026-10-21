import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";

import LoginPage from "./pages/LoginPage";

import Home from "./pages/Home";
import Material from "./pages/Material";
import AddItem from "./pages/AddItem";
import UpdateItem from "./pages/UpdateItem";
import Cocktails from "./pages/Cocktails";
import AddCocktail from "./pages/AddCocktail";
import UpdateCocktail from "./pages/UpdateCocktail";
import Cocktail from "./pages/Cocktail";
import Charts from "./pages/Charts";
import Layout from "./components/Layout";
import Missing from "./components/Missing";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<LoginPage />} path="/Login" />
        <Route path="/Charts" element={<Charts />} />
        <Route path="/" element={<Home />} exact />
        <Route path="/Material/:id" element={<Material />} />
        <Route path="/Cocktail/:id" element={<Cocktail />} />
        <Route element={<PrivateRoute />}>
          <Route path="/AddItem/:material" element={<AddItem />} />
          <Route path="/UpdateItem/:material/:id" element={<UpdateItem />} />
          <Route path="/Cocktails" element={<Cocktails />} />
          <Route path="/AddCocktail" element={<AddCocktail />} />
          <Route path="/UpdateCocktail/:id" element={<UpdateCocktail />} />
        </Route>
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
