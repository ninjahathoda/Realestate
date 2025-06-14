import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    const recent = JSON.parse(localStorage.getItem("lastSearchResults")) || [];
    setFavorites(favs);
    setRecentSearches(recent);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Dashboard</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Saved Favorites</h3>
        <div className="grid gap-4">
          {favorites.length === 0 && <p>No saved properties.</p>}
          {favorites.map((property) => (
            <Link to={`/property/${property.id}`} key={property.id}>
              <div className="p-4 border rounded bg-white shadow hover:bg-gray-50">
                <h4 className="font-semibold">{property.title}</h4>
                <p>{property.location}</p>
                <p>₹{property.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Searches</h3>
        <div className="grid gap-4">
          {recentSearches.length === 0 && <p>No recent searches.</p>}
          {recentSearches.map((property) => (
            <Link to={`/property/${property.id}`} key={property.id}>
              <div className="p-4 border rounded bg-white shadow hover:bg-gray-50">
                <h4 className="font-semibold">{property.title}</h4>
                <p>{property.location}</p>
                <p>₹{property.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
