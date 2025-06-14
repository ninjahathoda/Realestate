import React from "react";

function FilterBar({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex gap-4 mb-6">
      <select
        name="location"
        value={filters.location}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="">All Locations</option>
        <option value="Mumbai">Mumbai</option>
        <option value="Delhi">Delhi</option>
      </select>

      <select
        name="bedrooms"
        value={filters.bedrooms}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="">All Bedrooms</option>
        <option value="2">2 BHK</option>
        <option value="3">3 BHK</option>
      </select>
    </div>
  );
}

export default FilterBar;
