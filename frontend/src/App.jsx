import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "../Header/Navbar";
import HomePage from "../Pages/Home";
import Productdetails from "../Pages/Productdetails";
import Example from "../Product/Product";


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
           <Route path="/product" element={<Example />} />
      <Route path="/product/:id" element={<Productdetails />} />
        </Routes>

      </Router>

    </>
  );
}

export default App;
