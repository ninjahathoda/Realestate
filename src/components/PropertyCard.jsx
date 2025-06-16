import React from "react";

// Vibrant gradient backgrounds for empty images
const gradientBackgrounds = [
  "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400",
  "bg-gradient-to-br from-green-400 via-blue-500 to-purple-600",
  "bg-gradient-to-br from-yellow-400 via-red-400 to-pink-500",
];

const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? "#f43f5e" : "none"}
    viewBox="0 0 24 24"
    stroke="#f43f5e"
    className={`h-7 w-7 transition-all duration-300 drop-shadow-xl ${filled ? "scale-125" : ""}`}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
    />
  </svg>
);

const PropertyCard = ({
  property,
  onHeartClick,
  isFavorited,
  showHeart = true,
  onClick,
}) => {
  // Pick a random gradient for cards without images
  const gradientIdx = property._id
    ? property._id.charCodeAt(0) % gradientBackgrounds.length
    : 0;
  const bgClass = gradientBackgrounds[gradientIdx];

  return (
    <div
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      className={`
        group rounded-3xl shadow-2xl border border-gray-100 overflow-hidden cursor-pointer flex flex-col transition-all duration-500
        bg-white hover:shadow-[0_10px_40px_rgba(99,102,241,0.18)] hover:-translate-y-2 hover:ring-4 hover:ring-indigo-200
        relative
      `}
      aria-label={`View details for ${property.title}`}
      style={{ minHeight: 380, maxWidth: 400, margin: "auto" }}
    >
      {/* Image or gradient */}
      <div className="relative w-full h-56 overflow-hidden">
        {property.image ? (
          <img
            src={
              property.image.startsWith("http")
                ? property.image
                : `http://localhost:8000${property.image}`
            }
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-95"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${bgClass} animate-gradient-move`}>
            <svg
              className="w-16 h-16 text-white opacity-90 drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
            </svg>
          </div>
        )}
        {/* Favorite button */}
        {showHeart && (
          <button
            onClick={e => {
              e.stopPropagation();
              onHeartClick(property._id);
            }}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-lg hover:bg-pink-100 hover:scale-110 transition-all duration-300 focus:outline-none z-10"
          >
            <HeartIcon filled={isFavorited} />
          </button>
        )}
        {/* Property type badge */}
        {property.type && (
          <span className="absolute bottom-4 left-4 bg-indigo-700/90 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg select-none tracking-wide uppercase">
            {property.type}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col p-7 bg-gradient-to-br from-white via-indigo-50 to-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-extrabold text-indigo-700 drop-shadow-lg">
            ₹{property.price}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2 tracking-tight drop-shadow">
          {property.title}
        </h3>
        <div className="text-gray-500 text-sm mb-3 line-clamp-1 flex items-center gap-1">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.location}
        </div>
      </div>
      {/* Animation for gradient backgrounds */}
      <style>
        {`
          .animate-gradient-move {
            background-size: 200% 200%;
            animation: gradientMove 4s ease-in-out infinite;
          }
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      {/* Glowing border effect */}
      <span className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-indigo-400 group-hover:shadow-[0_0_24px_4px_rgba(99,102,241,0.15)] transition-all duration-500"></span>
    </div>
  );
};

export default PropertyCard;
