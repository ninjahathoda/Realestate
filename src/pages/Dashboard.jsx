import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const statCards = [
  { label: "Favorites", icon: "❤️", color: "from-pink-500 to-rose-400" },
  { label: "My Properties", icon: "🏠", color: "from-indigo-600 to-blue-400" },
  { label: "Bookmarked", icon: "🔖", color: "from-green-500 to-emerald-400" },
  { label: "Compared", icon: "📊", color: "from-yellow-400 to-orange-300" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([0, 0, 0, 0]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // Fetch user info and stats
    axios
      .get("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });

    // Simulate fetching stats and recent activity (replace with real API)
    setTimeout(() => {
      setStats([
        Math.floor(Math.random() * 8 + 2), // Favorites
        Math.floor(Math.random() * 5 + 1), // My Properties
        Math.floor(Math.random() * 4 + 1), // Bookmarked
        Math.floor(Math.random() * 3 + 1), // Compared
      ]);
      setRecent([
        { action: "Added a new property", time: "2 hours ago", icon: "🏠" },
        { action: "Favorited a listing", time: "4 hours ago", icon: "❤️" },
        { action: "Compared 3 properties", time: "Yesterday", icon: "📊" },
      ]);
      setLoading(false);
    }, 900);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E4B2] via-white to-[#003366] py-14 px-2 flex justify-center items-start">
      <div className="w-full max-w-4xl mx-auto">
        {/* Animated glass card */}
        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-10 mb-10 animate-fade-in overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute -inset-1 rounded-3xl z-0 pointer-events-none border-4 border-transparent"
            style={{
              background: "linear-gradient(120deg, #6366f1, #f43f5e, #facc15, #34d399, #6366f1)",
              backgroundSize: "300% 300%",
              filter: "blur(8px)",
              animation: "dashboardBorder 7s ease-in-out infinite"
            }}
          ></div>
          <div className="relative z-10 flex items-center gap-6 animate-slide-down">
            <img
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${user?.name || "Agent"}`}
              alt="User avatar"
              className="w-20 h-20 rounded-full border-4 border-indigo-200 shadow-lg bg-white"
            />
            <div>
              <h2 className="text-3xl font-extrabold text-indigo-800 mb-1 drop-shadow">Welcome, {user?.name || "Agent"}!</h2>
              <p className="text-gray-700 text-lg">Here’s your dashboard overview.</p>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, i) => (
            <div
              key={stat.label}
              className={`rounded-2xl shadow-lg bg-gradient-to-br ${stat.color} p-6 flex flex-col items-center text-white transform transition hover:scale-105 hover:shadow-2xl animate-fade-in`}
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <span className="text-4xl mb-2 drop-shadow">{stat.icon}</span>
              <span className="text-2xl font-extrabold tracking-tight animate-count">{loading ? "…" : stats[i]}</span>
              <span className="font-medium text-sm opacity-80">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-100 p-8 animate-fade-in">
          <h3 className="text-xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">🕒</span> Recent Activity
          </h3>
          <ul className="space-y-4">
            {loading
              ? <li className="text-gray-400">Loading activity…</li>
              : recent.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 group">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="flex-1 text-gray-800 group-hover:text-indigo-700 transition">{item.action}</span>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
      {/* Animations */}
      <style>
        {`
          @keyframes dashboardBorder {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-fade-in {
            animation: fadeIn 0.7s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-slide-down {
            animation: slideDown 0.8s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
