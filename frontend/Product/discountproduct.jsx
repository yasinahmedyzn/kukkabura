"use client";

import { useState } from "react";

const products = [
  {
    id: 1,
    brand: "Herlan",
    name: "Galactic Glam Lip Gloss – Secret Saturn",
    originalPrice: 1350,
    discountedPrice: 540,
    image: "https://herlan.com/wp-content/uploads/2024/10/1-Galactic-Glam-Lip-Gloss-Secret-Saturn-800x800.webp",
    hoverImage: "https://herlan.com/wp-content/uploads/2024/10/Lipgloss__Swatch_Solo_Secret-Saturn-800x800.webp",
  },
  {
    id: 2,
    brand: "Herlan",
    name: "Galactic Glam Holographic Lip Gloss – Shooting Star",
    originalPrice: 1350,
    discountedPrice: 540,
    image: "https://herlan.com/wp-content/uploads/2024/11/Skin-Mynt-Cream-Night-800x800.webp",
    hoverImage: "https://herlan.com/wp-content/uploads/2024/11/Skin-Mynt-Cream-Night-Cream_Laft-View.531-copy-800x800.webp",
  },
  {
    id: 3,
    brand: "Herlan",
    name: "Galactic Glam Lip Gloss – Supernova Sizzle",
    originalPrice: 1350,
    discountedPrice: 540,
    image: "https://herlan.com/wp-content/uploads/2025/02/Body-Serum-800x800.webp",
    hoverImage: "https://herlan.com/wp-content/uploads/2025/02/Body-Serum-1-800x800.webp",
  },
  {
    id: 4,
    brand: "Herlan",
    name: "Herlan Cushion Matte Lipstick Flamina Hot",
    originalPrice: 1550,
    discountedPrice: 620,
    image: "https://herlan.com/wp-content/uploads/2025/02/Body-Lotion-800x800.webp",
    hoverImage: "https://herlan.com/wp-content/uploads/2025/02/Body-Lotion-1-800x800.webp",
  },
  {
    id: 5,
    brand: "Herlan",
    name: "Herlan Cushion Matte Lipstick Vintage Vibes",
    originalPrice: 1550,
    discountedPrice: 620,
    image: "https://herlan.com/wp-content/uploads/2024/10/1-Galactic-Glam-Lip-Gloss-%E2%80%93-Shooting-Star-800x800.webp",
    hoverImage: "https://herlan.com/wp-content/uploads/2024/10/Lipgloss__Swatch_Solo_Shooting-Star-800x800.webp",
  },
  {
    id: 6,
    brand: "Herlan",
    name: "Galactic Glam Lip Gloss – Comet Crush",
    originalPrice: 1350,
    discountedPrice: 540,
    image: "https://herlan.com/wp-content/uploads/2023/12/1-Herlan-Cushion-Matte-Lipstick-Retrograde-Blue-800x800.webp",
    hoverImage: "https://herlan.com/wp-content/uploads/2023/12/2-Herlan-Cushion-Matte-Lipstick-Retrograde-Blue-800x800.webp",
  },
];

// Chevron SVG icons
const ChevronLeft = () => (
  <svg
    className="w-5 h-5 text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg
    className="w-5 h-5 text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Button component
const Button = ({ children, className = "", variant = "default", ...props }) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    default: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white focus:ring-gray-500",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function DiscountedProduct() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-gray-100">
      {/* Header */}
      <div className="flex justify-center items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Herlan Up To 60% Off
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          aria-label="Previous"
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors ${
            currentIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          <ChevronLeft />
        </button>

        {/* Right arrow */}
        <button
          onClick={nextSlide}
          disabled={currentIndex === maxIndex}
          aria-label="Next"
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors ${
            currentIndex === maxIndex ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          <ChevronRight />
        </button>

        {/* Product list */}
        <div className="overflow-hidden mx-8">
          <div
            className="flex transition-transform duration-300 ease-in-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              width: `${(products.length / itemsPerView) * 100}%`,
            }}
          >
            {products.map((product) => (
              <HoverImageCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile dots */}
      <div className="flex justify-center mt-6 gap-2 lg:hidden">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentIndex === idx ? "bg-green-600" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Separate card component to handle hover image swap
function HoverImageCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex-none bg-white rounded-md overflow-hidden relative shadow hover:shadow-md transition-shadow flex-shrink-0 cursor-pointer"
      style={{ width: `${100 / products.length}%` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={isHovered ? product.hoverImage : product.image}
          alt={product.name}
          className="w-full h-40 object-contain p-3 transition-transform duration-300"
        />
        <button className="absolute top-2 right-2 text-red-500 text-xl">♥</button>
      </div>

      <div className="px-3 pb-4 relative">
        <p className="text-sm font-semibold mt-2">{product.brand}</p>
        <p className="text-sm text-gray-700">{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm line-through text-gray-400">
            ৳ {product.originalPrice}
          </span>
          <span className="text-red-600 font-semibold">
            ৳ {product.discountedPrice}
          </span>
        </div>
        <button className="absolute bottom-3 right-3 text-gray-600 hover:text-black">🛒</button>
      </div>
    </div>
  );
}
