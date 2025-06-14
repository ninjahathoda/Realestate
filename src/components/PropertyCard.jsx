import React from "react";

function PropertyCard({ property }) {
  return (
    <div className="border rounded shadow hover:shadow-lg transition p-4">
      <img src={property.image} alt={property.title} className="w-full h-48 object-cover rounded mb-4" />
      <h3 className="text-xl font-semibold">{property.title}</h3>
      <p className="text-gray-600">{property.location}</p>
      <p className="font-bold">₹{property.price.toLocaleString()}</p>
      <p>{property.bedrooms} BHK</p>
    </div>
  );
}

export default PropertyCard;
