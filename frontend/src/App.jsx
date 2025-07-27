import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "../Header/Navbar";
import HomePage from "../Pages/Home";

import Example from "../Product/Product";
import DeskPage from "../Pages/Desk";
import SelfImprovementPage from "../Pages/selfimprovement";
import TravelPage from "../Pages/Travel";


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
        </Routes>

      </Router>

    </>
  );
}

export default App;
