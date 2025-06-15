import React, { useState } from "react";
import axios from "axios";

const Compare = () => {
  const [filters, setFilters] = useState({
    location: "",
    priceMin: "",
    priceMax: "",
    type: ""
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/properties", {
        ...filters,
        priceMin: Number(filters.priceMin),
        priceMax: Number(filters.priceMax)
      });
      setResults(response.data.results || []);
    } catch (err) {
      console.error("Error fetching properties:", err);
      alert("Failed to fetch properties.");
    }
    setLoading(false);
  };

  const handleScrapeNow = async () => {
    setScraping(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/scrape-magicbricks?city=${filters.location || "noida"}`);
      setResults(response.data.results || []);
    } catch (err) {
      console.error("Error scraping MagicBricks:", err);
      alert("Scraping failed. Make sure backend is running.");
    }
    setScraping(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E4B2] via-white to-[#003366] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#003366] mb-10 text-center tracking-tight">
          🏠 Compare Properties
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-white/80 rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <input
            type="text"
            name="location"
            placeholder="City or Area"
            value={filters.location}
            onChange={handleChange}
            className="px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-600 font-body text-gray-800 bg-gray-50 placeholder:text-gray-400 transition"
          />
          <input
            type="number"
            name="priceMin"
            placeholder="Min Price"
            value={filters.priceMin}
            onChange={handleChange}
            className="px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-600 font-body text-gray-800 bg-gray-50 placeholder:text-gray-400 transition"
          />
          <input
            type="number"
            name="priceMax"
            placeholder="Max Price"
            value={filters.priceMax}
            onChange={handleChange}
            className="px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-600 font-body text-gray-800 bg-gray-50 placeholder:text-gray-400 transition"
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-600 font-body text-gray-800 bg-gray-50 transition"
          >
            <option value="">Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Flat">Flat</option>
          </select>
        </form>

        <div className="mb-6 text-center">
          <button
            onClick={handleScrapeNow}
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-6 py-3 rounded-full shadow transition"
          >
            {scraping ? "Comparing..." : "⚙️ Compare"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.length > 0 ? (
            results.map((property, index) => (
              <div
                key={property.id || index}
                className="bg-white rounded-xl shadow border border-gray-200 hover:shadow-md transition p-4 flex flex-col items-center"
              >
                <h3 className="text-lg font-semibold text-indigo-800 mb-2 text-center">{property.title}</h3>
                <div className="text-gray-700 font-body mb-1 text-center">
                  <span className="font-bold">📍 Location:</span> {property.location}
                </div>
                <div className="text-indigo-700 font-body mb-2 text-center">
                  <span className="font-bold">💰 Price:</span> {property.price}
                </div>
                {property.image && (
                  <img
                    src={property.image.startsWith("/images") ? `http://localhost:8000${property.image}` : property.image}
                    alt="Property"
                    className="w-full h-44 object-cover rounded-lg border border-gray-100 mt-2"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full font-body text-lg">No properties found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compare;
