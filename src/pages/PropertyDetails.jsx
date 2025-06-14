import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("lastSearchResults");
    if (data) {
      const properties = JSON.parse(data);
      const found = properties.find((p) => String(p.id) === id);
      setProperty(found);
    }
  }, [id]);

  const handleSaveFavorite = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to save favorites.");
      return;
    }

    const favoritesKey = `favorites_${user.email}`;
    const currentFavorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

    // Avoid duplicates
    const alreadySaved = currentFavorites.some((fav) => fav.id === property.id);
    if (!alreadySaved) {
      const updated = [...currentFavorites, property];
      localStorage.setItem(favoritesKey, JSON.stringify(updated));
      alert("Added to favorites!");
    } else {
      alert("This property is already in your favorites.");
    }
  };

  if (!property) {
    return <div className="p-4">Loading property details...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{property.title}</h2>
      {property.image && (
        <img
          src={property.image}
          alt={property.title}
          className="w-full max-h-96 object-cover mb-4 rounded"
        />
      )}
      <p className="text-lg mb-2">Location: {property.location}</p>
      <p className="text-lg mb-2">Price: ₹{property.price}</p>
      <p className="text-lg mb-4">Type: {property.type}</p>
      <button
        onClick={handleSaveFavorite}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save to Favorites
      </button>
    </div>
  );
};

export default PropertyDetails;
