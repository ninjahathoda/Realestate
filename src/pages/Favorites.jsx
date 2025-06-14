import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Favorite Properties</h2>
      <div className="grid gap-4">
        {favorites.length === 0 && <p>No favorites yet.</p>}
        {favorites.map((property) => (
          <Link to={`/property/${property.id}`} key={property.id}>
            <div className="p-4 border rounded shadow-md bg-white hover:bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
              <p>Location: {property.location}</p>
              <p>Price: ₹{property.price}</p>
              <p>Type: {property.type}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
