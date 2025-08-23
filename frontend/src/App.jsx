import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../Header/Navbar";
import HomePage from "../Pages/Home";
import Login from "../Auth/loginForm";
import Registration from "../Auth/RegistrationForm";
import Success from "../Auth/success";
import Admin_dashboard from "../Auth/admindashboard";
import { AuthProvider } from "./context/AuthContext.jsx";
import CartPage from "../Pages/CartPage.jsx";
import CategoryPage from "../Catagory/CategoryPage.jsx";
import EyeProducts from "../Pages/eyes.jsx";
import MakeupProducts from "../Pages/Makeup.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/success" element={<Success />} />
          <Route path="/admin-dashboard" element={<Admin_dashboard />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product" element={<CategoryPage />} />
          <Route path="/product/eyes-products" element={<EyeProducts />} />
          <Route path="/product/makeup-products" element={<MakeupProducts />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
