import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../Header/Navbar";
import HomePage from "../Pages/Home";
import Example from "../Product/Product";
import DeskPage from "../Pages/Desk";
import SelfImprovementPage from "../Pages/selfimprovement";
import TravelPage from "../Pages/Travel";
import Login from "../Auth/loginForm";
import Registration from "../Auth/RegistrationForm";
import Success from "../Auth/success";
import Admin_dashboard from "../Auth/admindashboard";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./utils/PrivateRoute";
import CartPage from "../Pages/CartPage.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<Example />} />
          <Route path="/Desk" element={<DeskPage />} />
          <Route path="/Self" element={<SelfImprovementPage />} />
          <Route path="/Travel" element={<TravelPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/success" element={<Success />} />
          <Route path="/admin-dashboard" element={<Admin_dashboard />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
