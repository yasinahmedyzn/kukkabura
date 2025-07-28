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

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<Example />} />

          <Route path="/Desk" element={<DeskPage />} />
          <Route path="/Self" element={<SelfImprovementPage />} />
          <Route path="/Travel" element={<TravelPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
