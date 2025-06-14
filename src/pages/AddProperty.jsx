// AddProperty.jsx (Frontend component to add a property and upload an image)

import React, { useState } from "react";
import axios from "axios";

const AddProperty = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", image);
    const res = await axios.post("http://localhost:8000/api/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setImageUrl(res.data.url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProperty = {
      title,
      location,
      price: Number(price),
      type,
      image: imageUrl,
    };
    console.log("Submit Property:", newProperty);
    // You can POST this to your backend or add it to mock_properties in dev
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Select Type</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Flat">Flat</option>
        </select>

        <input type="file" onChange={handleImageChange} className="w-full" />
        <button type="button" onClick={handleImageUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload Image
        </button>
        {imageUrl && <img src={imageUrl} alt="Preview" className="w-40 mt-2" />}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Property
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
