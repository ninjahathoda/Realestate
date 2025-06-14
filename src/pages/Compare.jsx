import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
      setResults(response.data.results);
      localStorage.setItem("lastSearchResults", JSON.stringify(response.data.results));
    } catch (err) {
      console.error("Error fetching properties:", err);
      alert("Failed to fetch properties.");
    }
    setLoading(false);
  };

  const handleScrapeNow = async () => {
  setScraping(true);
  try {
    const response = await axios.get("http://localhost:8000/api/scrape-magicbricks", {
      params: {
        city: filters.location || "noida"
      }
    });
    setResults(response.data.results);
  } catch (err) {
    console.error("❌ Frontend scrape error:", err.response?.data || err.message);
    alert("Failed to scrape MagicBricks.");
  }
  setScraping(false);
};




  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Compare Properties</h2>

      {/* Filter Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="priceMin"
          placeholder="Min Price"
          value={filters.priceMin}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="priceMax"
          placeholder="Max Price"
          value={filters.priceMax}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Select Type</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Flat">Flat</option>
        </select>
        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Compare"}
        </button>
      </form>

      {/* Scrape Button */}
      <div className="mb-4">
        <button
          onClick={handleScrapeNow}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {scraping ? "Scraping..." : "Scrape Now (MagicBricks)"}
        </button>
      </div>

      {/* Results */}
      <div className="grid gap-4">
        {results.length === 0 && (
          <p className="text-gray-500">No properties to show. Try filtering or scraping.</p>
        )}
        {results.map((property, index) => (
          <Link to={`/property/${property.id || index}`} key={property.id || index}>
            <div className="p-4 border rounded shadow-md bg-white hover:bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
              <p>Location: {property.location}</p>
              <p>Price: {property.price}</p>
              {property.image && (
                <img
                  src={property.image}
                  alt="property"
                  className="w-full mt-2 rounded max-h-52 object-cover"
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Compare;
