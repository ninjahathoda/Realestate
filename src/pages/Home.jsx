import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/api/properties")
      .then(res => {
        setProperties(res.data.results);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch properties:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading properties...</div>;
  if (properties.length === 0) return <div className="p-4">No properties found.</div>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {properties.map((p) => (
        <PropertyCard key={p._id} property={p} />
      ))}
    </div>
  );
};

export default Home;
