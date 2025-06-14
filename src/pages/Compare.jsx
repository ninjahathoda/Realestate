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
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🏠 Compare Properties</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="location"
          placeholder="City or Area"
          value={filters.location}
          onChange={handleChange}
          className="p-2 border rounded shadow"
        />
        <input
          type="number"
          name="priceMin"
          placeholder="Min Price"
          value={filters.priceMin}
          onChange={handleChange}
          className="p-2 border rounded shadow"
        />
        <input
          type="number"
          name="priceMax"
          placeholder="Max Price"
          value={filters.priceMax}
          onChange={handleChange}
          className="p-2 border rounded shadow"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="p-2 border rounded shadow"
        >
          <option value="">Type</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Flat">Flat</option>
        </select>

        <button
          type="submit"
          className="col-span-full md:col-span-2 lg:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Comparing..." : "🔍 Compare"}
        </button>
      </form>

      <div className="mb-4 text-center">
        <button
          onClick={handleScrapeNow}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
        >
          {scraping ? "Scraping..." : "⚙️ Scrape Now (MagicBricks)"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.length > 0 ? (
          results.map((property, index) => (
            <div
              key={property.id || index}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition bg-white"
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-2">{property.title}</h3>
              <p><strong>📍 Location:</strong> {property.location}</p>
              <p><strong>💰 Price:</strong> {property.price}</p>
              {property.image && (
                <img
                  src={property.image.startsWith("/images") ? `http://localhost:8000${property.image}` : property.image}
                  alt="Property"
                  className="w-full h-48 object-cover mt-2 rounded"
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No properties found.</p>
        )}
      </div>
    </div>
  );
};

export default Compare;
