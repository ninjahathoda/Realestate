import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import PropertyDetails from "./pages/PropertyDetails";
import Favorites from "./pages/Favorites";
import Dashboard from "./pages/Dashboard";
import AddProperty from "./pages/AddProperty";
import UploadProperty from "./pages/UploadProperty";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/upload" element={<UploadProperty />} />
      </Routes>
    </Router>
  );
}

export default App;
