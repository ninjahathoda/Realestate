import React, { useEffect, useState } from "react";
import axios from "axios";

// Modal for property details (optional, for a premium touch)
const Modal = ({ property, onClose }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative border border-gray-200 animate-fade-in">
      <button
        className="absolute top-3 right-3 text-indigo-700 hover:text-indigo-900 text-2xl"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      {property.image && (
        <img
          src={property.image.startsWith("http") ? property.image : `http://localhost:8000${property.image}`}
          alt={property.title}
          className="w-full h-48 object-cover rounded-lg border border-gray-100 mb-4"
        />
      )}
      <h3 className="text-2xl font-bold text-indigo-800 mb-2">{property.title}</h3>
      <div className="text-gray-700 mb-1">{property.location}</div>
      <div className="text-indigo-700 font-semibold mb-2">{property.price}</div>
      {/* Add more property details here if needed */}
    </div>
  </div>
);

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/favorites")
      .then(res => setFavorites(res.data.results || []));
  }, []);

  const handleHeartClick = async (property_id) => {
    await axios.post(
      "http://localhost:8000/api/favorites/remove",
      new URLSearchParams({ property_id }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    setFavorites(favorites.filter(p => p._id !== property_id));
    setToast("Removed from favorites!");
    setTimeout(() => setToast(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E4B2] via-white to-[#003366] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#003366] mb-10 text-center tracking-tight">
          Your Favorite Properties
        </h2>
        {toast && (
          <div className="fixed top-4 right-4 bg-indigo-700 text-white px-4 py-2 rounded shadow-lg z-50 font-medium animate-fade-in">
            {toast}
          </div>
        )}
        {favorites.length === 0 ? (
          <div className="text-gray-500 text-lg py-16 text-center">
            You have no favorite properties yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {favorites.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-xl shadow border border-gray-200 hover:shadow-md transition p-4 flex flex-col relative cursor-pointer"
                onClick={() => setSelected(property)}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${property.title}`}
              >
                {property.image && (
                  <img
                    src={property.image.startsWith("http") ? property.image : `http://localhost:8000${property.image}`}
                    alt={property.title}
                    className="h-40 w-full object-cover rounded-lg border border-gray-100 mb-3"
                  />
                )}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleHeartClick(property._id);
                  }}
                  className="absolute top-3 right-3 bg-white rounded-full p-1 shadow hover:bg-indigo-50 transition"
                  aria-label="Remove from favorites"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#6366f1"
                    viewBox="0 0 24 24"
                    stroke="#6366f1"
                    className="h-6 w-6 text-indigo-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                    />
                  </svg>
                </button>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-1">{property.title}</h3>
                  <div className="text-gray-700 mb-1">{property.location}</div>
                  <div className="text-indigo-600 font-bold mb-2">{property.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {selected && <Modal property={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
};

export default Favorites;
