import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");         // NEW: name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/auth/signup", {
        name,
        email,
        password
      });
      setToast("Signup successful! Please log in.");
      setTimeout(() => {
        setToast(null);
        navigate("/login");
      }, 1200);
    } catch (err) {
      setToast(
        err.response?.data?.detail === "Email already registered"
          ? "Email already registered."
          : "Signup failed. Please check your details."
      );
      setTimeout(() => setToast(null), 1800);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5E4B2] via-white to-[#003366]">
      <form
        onSubmit={handleSignup}
        className="bg-white rounded-xl shadow-2xl px-10 py-12 w-full max-w-md border border-gray-200 flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold text-indigo-800 mb-6">Create Account</h2>
        <input
          type="text"
          required
          placeholder="Name"
          className="w-full mb-4 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-600 font-body text-gray-800 bg-gray-50 placeholder:text-gray-400"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          required
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-600 font-body text-gray-800 bg-gray-50 placeholder:text-gray-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-600 font-body text-gray-800 bg-gray-50 placeholder:text-gray-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-full px-4 py-3 shadow transition mb-2"
        >
          Sign Up
        </button>
        <p className="text-gray-700 mt-4 font-body">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer text-indigo-700 hover:text-indigo-900"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
        {toast && (
          <div className="fixed top-4 right-4 bg-indigo-700 text-white px-4 py-2 rounded shadow-lg font-medium animate-fade-in z-50">
            {toast}
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
