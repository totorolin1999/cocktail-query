import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";

import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Material from "./pages/Material";
import AddItem from "./pages/AddItem";
import UpdateItem from "./pages/UpdateItem";
import Dashboard from "./pages/Dashboard";
import AddCocktail from "./pages/AddCocktail";
import UpdateCocktail from "./pages/UpdateCocktail";
import Cocktail from "./pages/Cocktail";
import Charts from "./pages/Charts";
import SystemDesign from "./pages/SystemDesign";
import Layout from "./components/Layout";
import Missing from "./components/Missing";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 公開瀏覽頁面 */}
        <Route path="/" element={<Home />} exact />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/system-design" element={<SystemDesign />} />
        <Route path="/cocktails/:id" element={<Cocktail />} />
        <Route path="/materials/:material" element={<Material />} />
        <Route path="/materials/:id" element={<Material />} />

        {/* 管理後台受保護頁面 */}
        <Route element={<PrivateRoute />}>
          <Route path="/cocktails" element={<Dashboard />} />
          <Route path="/cocktails/new" element={<AddCocktail />} />
          <Route path="/cocktails/:id/edit" element={<UpdateCocktail />} />
          <Route path="/materials/:material/new" element={<AddItem />} />
          <Route path="/materials/:material/:id/edit" element={<UpdateItem />} />
        </Route>

        {/* 404 頁面 */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
