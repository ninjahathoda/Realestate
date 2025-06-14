import React, { useState } from "react";
import axios from "axios";

const UploadProperty = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!file) {
      alert("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const filename = res.data.filename;
      const url = `http://localhost:8000/images/${filename}`;
      setImageUrl(url);
      alert("Upload successful!");
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload image.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Property Image</h2>
      <input type="file" onChange={handleImageChange} />
      <button
        type="button"
        onClick={handleImageUpload}
        className="bg-blue-500 px-2 py-1 rounded text-white mt-2"
      >
        Upload Image
      </button>
      {imageUrl && (
        <div className="mt-4">
          <p className="mb-2">Preview:</p>
          <img src={imageUrl} alt="Preview" className="w-40 border rounded" />
        </div>
      )}
    </div>
  );
};

export default UploadProperty;
