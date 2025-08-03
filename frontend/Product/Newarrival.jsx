"use client";

import { useState } from "react";

const products = [
  {
    id: 1,
    name: "TRN MT1 Pro Professional Hi-Fi Dynamic Earphones",
    price: "৳850.00",
    image:
      "https://gadgetmonkeybd.com/public/uploads/all/r3INpJY8U48uAMyLjZf3rBxH14u0sYaYk4G0jB61.webp",
  },
  {
    id: 2,
    name: "Apple Airpods Pro (2nd Generation) ANC Dubai Copy",
    price: "৳1,699.00",
    image:
      "https://gadgetmonkeybd.com/public/uploads/all/deOMuVh8IUVR12DCxOmYlZqiIv8Ph62I1LjyUI9Z.jpg",
  },
  {
    id: 3,
    name: "QCY ArcBuds HT07 ANC TWS Earbuds",
    price: "৳2,200.00",
    image:
      "https://gadgetmonkeybd.com/public/uploads/all/40uOQ35yyJifXQqrGCC8ZILA3Ue2P1TzmbZ0k6Ss.jpg",
  },
  {
    id: 4,
    name: "Moondrop Chu 2 Dynamic Driver In-Ear Headphone",
    price: "৳2,100.00",
    image:
      "https://gadgetmonkeybd.com/public/uploads/all/wdrxVGHLEfq1xOitNRPgJksYOj8EDwQmO04W94WV.jpg",
  },
  {
    id: 5,
    name: "KBEAR 4 core silver plated copper cable with mic",
    price: "৳699.00",
    image:
      "https://gadgetmonkeybd.com/public/uploads/all/KuoRwWCaSVHdefeSClQY9eLRVjsVieSTy4Igcw54.jpg",
  },
];

const ChevronLeft = () => (
  <svg
    className="w-5 h-5 text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    className="w-5 h-5 text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

// Custom Button Component
const Button = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    default: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white focus:ring-gray-500",
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

export default function Newarrival() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4; // Number of items visible at once on desktop
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-center flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            New Arrival Product
          </h2>
          <p className="text-green-600 font-medium">
            This products listed by this month
          </p>
        </div>
      </div>

      {/* Product Carousel */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight />
        </button>

        {/* Products Grid */}
        <div className="overflow-hidden mx-8">
          <div
            className="flex transition-transform duration-300 ease-in-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              width: `${(products.length / itemsPerView) * 100}%`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ width: `${100 / products.length}%` }}
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-50 p-4 transition-transform duration-300">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>

                  <div className="text-lg font-bold text-green-600 mb-4">
                    {product.price}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1 text-sm py-2">Buy Now</Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-sm py-2 bg-transparent"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="flex justify-center mt-6 gap-2 lg:hidden">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentIndex === index ? "bg-green-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
