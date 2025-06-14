import React, { useEffect, useState } from "react";
import axios from "axios";

const PropertyList = () => {
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

  if (loading) return <div>Loading properties...</div>;
  if (properties.length === 0) return <div>No properties found.</div>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {properties.map((property) => (
        <div
          key={property._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            width: "300px",
            background: "#fff"
          }}
        >
          <img
            src={
              property.image && property.image.startsWith("/")
                ? `http://localhost:8000${property.image}`
                : property.image ||
                  "https://via.placeholder.com/300x200?text=No+Image"
            }
            alt={property.title}
            style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "4px" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
          <h3 style={{ margin: "8px 0 4px" }}>{property.title}</h3>
          <div style={{ color: "#555" }}>{property.location}</div>
          <div style={{ color: "#008000", fontWeight: "bold" }}>{property.price}</div>
          <div style={{ color: "#0074d9" }}>{property.type}</div>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
