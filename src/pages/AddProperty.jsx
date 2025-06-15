import React, { useState } from "react";
import axios from "axios";

// Demo AI Description Helper (for UX wow)
const aiSuggestDescription = (title, location, type) => {
  if (!title && !location && !type) return "";
  return `Discover this stunning ${type || "property"} titled "${title || "..." }" located in ${location || "..."}. Perfect for modern living!`;
};

const AddProperty = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Personalization: get user name from localStorage or context
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "Agent";

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleImageUpload = async () => {
    if (!image) return alert("Please select an image first.");
    const formData = new FormData();
    formData.append("file", image);
    try {
      const res = await axios.post("http://localhost:8000/api/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(`http://localhost:8000${res.data.url}`);
      setToast("Image uploaded!");
      setTimeout(() => setToast(null), 1200);
    } catch (err) {
      setToast("Failed to upload image.");
      setTimeout(() => setToast(null), 1800);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !location || !price || !type || !imageUrl || !description) {
      setToast("Please fill in all fields and upload an image.");
      setTimeout(() => setToast(null), 1800);
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("image", imageUrl);

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/add-property", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setToast("Property added successfully!");
      setTitle(""); setLocation(""); setPrice(""); setType(""); setDescription(""); setImage(null); setImageUrl("");
      setStep(1);
    } catch (err) {
      setToast("Failed to add property.");
    }
    setLoading(false);
    setTimeout(() => setToast(null), 1500);
  };

  // Progress bar steps
  const steps = [
    { label: "Details", icon: "🏠" },
    { label: "Photo", icon: "🖼️" },
    { label: "Description", icon: "✍️" },
    { label: "Review", icon: "✅" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E4B2] via-white to-[#003366] py-16 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 border border-gray-200 animate-fade-in relative overflow-hidden">
        {/* Floating property image preview with motion */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="absolute -top-24 right-10 w-48 h-48 object-cover rounded-2xl shadow-xl border-4 border-white animate-float"
            style={{ zIndex: 2, filter: "drop-shadow(0 8px 24px rgba(99,102,241,0.12))" }}
          />
        )}

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-10">
          {steps.map((s, i) => (
            <div key={s.label} className="flex-1 flex flex-col items-center">
              <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold transition-all duration-300
                ${step === i+1 ? "bg-indigo-600 text-white scale-110 shadow-lg" : "bg-indigo-100 text-indigo-600"}`}>
                {s.icon}
              </div>
              <span className={`mt-2 text-xs font-semibold ${step === i+1 ? "text-indigo-700" : "text-gray-400"}`}>{s.label}</span>
              {i < steps.length-1 && <div className="h-1 w-full bg-gradient-to-r from-indigo-200 to-indigo-400 mt-2" />}
            </div>
          ))}
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 bg-indigo-700 text-white px-4 py-2 rounded shadow-lg font-medium animate-fade-in z-50">
            {toast}
          </div>
        )}

        <h2 className="text-3xl font-extrabold text-[#003366] mb-2 text-center drop-shadow">
          Welcome, {userName}! <span className="block text-lg font-normal text-indigo-700 mt-1">Let's add a new property</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8 mt-8">
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <input
                type="text"
                placeholder="Property Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-800 placeholder:text-gray-400 transition-all shadow-sm hover:shadow-md"
                autoFocus
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-800 placeholder:text-gray-400 transition-all shadow-sm hover:shadow-md"
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-800 placeholder:text-gray-400 transition-all shadow-sm hover:shadow-md"
              />
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-800 transition-all shadow-sm hover:shadow-md"
              >
                <option value="">Select Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Flat">Flat</option>
              </select>
            </div>
          )}

          {/* Step 2: Photo */}
          {step === 2 && (
            <div className="flex flex-col items-center gap-6 animate-fade-in">
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
              />
              <button
                type="button"
                onClick={handleImageUpload}
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-6 py-2 rounded-full shadow transition flex items-center gap-2"
              >
                <span>Upload Image</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                </svg>
              </button>
              {imageUrl && (
                <div className="flex justify-center mt-4">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-44 h-44 object-cover rounded-2xl border-4 border-indigo-200 shadow-xl transition-transform duration-500 transform scale-100 hover:scale-105 animate-fade-in"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Description with AI Helper */}
          {step === 3 && (
            <div className="animate-fade-in">
              <label className="block mb-2 font-semibold text-indigo-700">Description</label>
              <textarea
                rows={4}
                placeholder="Describe your property..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-800 placeholder:text-gray-400 transition-all shadow-sm hover:shadow-md"
              />
              <button
                type="button"
                onClick={() => setDescription(aiSuggestDescription(title, location, type))}
                className="mt-3 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-semibold px-4 py-2 rounded-full shadow transition"
              >
                ✨ Suggest Description (AI)
              </button>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-indigo-700 mb-4">Review Your Listing</h3>
              <ul className="mb-6 space-y-2">
                <li><b>Title:</b> {title}</li>
                <li><b>Location:</b> {location}</li>
                <li><b>Price:</b> {price}</li>
                <li><b>Type:</b> {type}</li>
                <li><b>Description:</b> {description}</li>
                <li>
                  <b>Image:</b>
                  {imageUrl && <img src={imageUrl} alt="Preview" className="inline-block ml-2 w-16 h-16 object-cover rounded-md border" />}
                </li>
              </ul>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold rounded-full px-6 py-3 shadow-lg transition-all flex justify-center items-center gap-2 text-lg"
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {loading ? "Submitting..." : "Add Property"}
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-full shadow transition"
                onClick={() => setStep(step - 1)}
              >
                ← Back
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-6 py-2 rounded-full shadow transition ml-auto"
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && (!title || !location || !price || !type)) ||
                  (step === 2 && !imageUrl) ||
                  (step === 3 && !description)
                }
              >
                Next →
              </button>
            )}
          </div>
        </form>
      </div>
      {/* Animations */}
      <style>
        {`
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes float {
            0% { transform: translateY(0px);}
            50% { transform: translateY(-18px);}
            100% { transform: translateY(0px);}
          }
          .animate-fade-in {
            animation: fadeIn 0.7s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default AddProperty;
