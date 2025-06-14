// AddProperty.jsx – Fully Updated

import React, { useState } from "react";
import axios from "axios";

const AddProperty = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!image) return alert("Please select an image first.");
    const formData = new FormData();
    formData.append("image", image); // ✅ use "image" key as per FastAPI backend
    try {
      const res = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(`http://localhost:8000${res.data.image_url}`);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !location || !price || !type || !imageUrl) {
      return alert("Please fill in all fields and upload image.");
    }

    const newProperty = {
      title,
      location,
      price: Number(price),
      type,
      image_url: imageUrl,
    };

    console.log("Submit Property:", newProperty);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/add-property", newProperty);
      alert("Property added successfully!");
      // Clear form
      setTitle(""); setLocation(""); setPrice(""); setType(""); setImage(null); setImageUrl("");
    } catch (err) {
      console.error("Add property failed:", err);
      alert("Failed to add property.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-4">Add New Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Type</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Flat">Flat</option>
        </select>

        <div className="space-y-2">
          <input type="file" onChange={handleImageChange} className="w-full" />
          <button
            type="button"
            onClick={handleImageUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload Image
          </button>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-40 h-40 object-cover mt-2 rounded border"
              onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Submitting..." : "Add Property"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
