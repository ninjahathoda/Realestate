import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for login/logout changes
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-8 py-3 flex justify-between items-center">
      <div className="text-2xl font-bold text-indigo-800 tracking-tight font-sans">
        <Link to="/">RealEstate Pro</Link>
      </div>
      <div className="space-x-2 flex items-center">
        <Link to="/" className="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">Home</Link>
        <Link to="/favorites" className="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">Favorites</Link>
        <Link to="/compare" className="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">Compare</Link>
        <Link to="/add-property" className="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">Add Property</Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="px-4 py-2 rounded-md font-medium text-indigo-700 border border-indigo-600 hover:bg-indigo-600 hover:text-white transition">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="ml-2 bg-indigo-600 px-4 py-2 rounded-md text-white font-medium shadow hover:bg-indigo-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" className="px-4 py-2 rounded-md font-medium text-indigo-700 border border-indigo-600 hover:bg-indigo-600 hover:text-white transition">Signup</Link>
            <Link to="/login" className="px-4 py-2 rounded-md font-medium text-indigo-700 border border-indigo-600 hover:bg-indigo-600 hover:text-white transition">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
