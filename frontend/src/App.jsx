import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../Header/Navbar";
import HomePage from "../Pages/Home";
import Login from "../Auth/loginForm";
import Registration from "../Auth/RegistrationForm";
import Admin_dashboard from "../Auth/admindashboard";
import { AuthProvider } from "./context/AuthContext.jsx";
import CartPage from "../Pages/CartPage.jsx";
import CategoryPage from "../Catagory/CategoryPage.jsx";
import EyeProducts from "../Pages/eyes.jsx";
import MakeupProducts from "../Pages/Makeup.jsx";
import FragnanceProducts from "../Pages/Fragnance.jsx";
import SkincareProducts from "../Pages/Skincare.jsx";
import HaircareProducts from "../Pages/Haircare.jsx";
import ToolsBrushProducts from "../Pages/ToolsBrush.jsx";
import BathBodyProducts from "../Pages/BathBody.jsx";
import FaceProducts from "../Pages/Face.jsx";
import LipProducts from "../Pages/Lip.jsx";
import Profile from "../Auth/profile.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-dashboard" element={<Admin_dashboard />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product" element={<CategoryPage />} />
          <Route path="/product/eyes-products" element={<EyeProducts />} />
          <Route path="/product/face-products" element={<FaceProducts />} />
          <Route path="/product/lip-products" element={<LipProducts />} />
          <Route path="/product/makeup-products" element={<MakeupProducts />} />
          <Route path="/product/fragnance-products" element={<FragnanceProducts />} />
          <Route path="/product/skincare-products" element={<SkincareProducts />} />
          <Route path="/product/haircare-products" element={<HaircareProducts />} />
          <Route path="/product/tools-brushes-products" element={<ToolsBrushProducts />} />
          <Route path="/product/bath&body-products" element={<BathBodyProducts />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
