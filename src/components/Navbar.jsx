import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="text-lg font-bold">
        <Link to="/">RealEstate App</Link>
      </div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/compare">Compare</Link>
        <Link to="/favorites">Favorites</Link> {/* 👈 ADD THIS LINE */}
        <Link to="/add-property">Add Property</Link>
        <Link to="/upload">Upload</Link>
        {!user && <Link to="/signup">Signup</Link>}
        {!user && <Link to="/login">Login</Link>}
        {user && <Link to="/dashboard">Dashboard</Link>}
        
        {user && (
          <>
            <span>{user.email}</span>
            <button onClick={handleLogout} className="bg-red-600 px-2 py-1 rounded">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
