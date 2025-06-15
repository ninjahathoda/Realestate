import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/properties")
      .then(res => setProperties(res.data.results || []));
    axios.get("http://localhost:8000/api/favorites")
      .then(res => setFavoriteIds((res.data.results || []).map(p => p._id)));
  }, []);

  const handleHeartClick = async (property_id) => {
    if (favoriteIds.includes(property_id)) {
      await axios.post(
        "http://localhost:8000/api/favorites/remove",
        new URLSearchParams({ property_id }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      setFavoriteIds(favoriteIds.filter(id => id !== property_id));
      setToast("Removed from favorites!");
    } else {
      await axios.post(
        "http://localhost:8000/api/favorites/add",
        new URLSearchParams({ property_id }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      setFavoriteIds([...favoriteIds, property_id]);
      setToast("Added to favorites!");
    }
    setTimeout(() => setToast(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E4B2] via-white to-[#003366] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-white/90 rounded-xl shadow-lg p-8 flex flex-col items-center md:flex-row md:justify-between md:items-center">
            <div className="mb-6 md:mb-0 md:w-2/3">
              <h1 className="text-4xl font-bold text-[#003366] mb-4 tracking-tight">
                Find Your Dream Home
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Browse our curated listings of premium properties. Whether you’re buying, selling, or renting, we help you make the right move.
              </p>
              <a
                href="#properties"
                className="inline-block bg-indigo-700 text-white font-semibold px-6 py-3 rounded-md shadow hover:bg-indigo-800 transition"
              >
                Explore Properties
              </a>
            </div>
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
              alt="Modern Home"
              className="w-full md:w-1/3 rounded-lg shadow-md object-cover"
            />
          </div>
        </section>

        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 bg-indigo-700 text-white px-4 py-2 rounded shadow-lg z-50 font-medium animate-fade-in">
            {toast}
          </div>
        )}

        {/* Properties Section */}
        <section id="properties">
          <h2 className="text-2xl font-bold text-[#003366] mb-8 text-center tracking-tight">
            Featured Properties
          </h2>
          {properties.length === 0 ? (
            <div className="text-gray-500 text-lg py-16 text-center">No properties found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isFavorited={favoriteIds.includes(property._id)}
                  onHeartClick={handleHeartClick}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
