"use client";
import { useState, useEffect } from "react";

const products = [
  {
    id: 1,
    name: "TRN MT1 Pro Professional Hi-Fi Dynamic Earphones",
    price: "৳850.00",
    image: "https://gadgetmonkeybd.com/public/uploads/all/r3INpJY8U48uAMyLjZf3rBxH14u0sYaYk4G0jB61.webp",
  },
  {
    id: 2,
    name: "Apple Airpods Pro (2nd Generation) ANC Dubai Copy",
    price: "৳1,699.00",
    image: "https://gadgetmonkeybd.com/public/uploads/all/deOMuVh8IUVR12DCxOmYlZqiIv8Ph62I1LjyUI9Z.jpg",
  },
  {
    id: 3,
    name: "QCY ArcBuds HT07 ANC TWS Earbuds",
    price: "৳2,200.00",
    image: "https://gadgetmonkeybd.com/public/uploads/all/40uOQ35yyJifXQqrGCC8ZILA3Ue2P1TzmbZ0k6Ss.jpg",
  },
  {
    id: 4,
    name: "Moondrop Chu 2 Dynamic Driver In-Ear Headphone",
    price: "৳2,100.00",
    image: "https://gadgetmonkeybd.com/public/uploads/all/wdrxVGHLEfq1xOitNRPgJksYOj8EDwQmO04W94WV.jpg",
  },
  {
    id: 5,
    name: "KBEAR 4 core silver plated copper cable with mic",
    price: "৳699.00",
    image: "https://gadgetmonkeybd.com/public/uploads/all/KuoRwWCaSVHdefeSClQY9eLRVjsVieSTy4Igcw54.jpg",
  },
];

const ChevronLeft = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Button = ({ children, className = "", variant = "default", ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    default: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white focus:ring-gray-500",
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function Newarrival() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth < 768 ? 1 : 4); // Mobile = 1, Desktop = 4
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-center flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">New Arrival Product</h2>
          <p className="text-green-600 font-medium">This products listed by this month</p>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50">
          <ChevronLeft />
        </button>
        <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50">
          <ChevronRight />
        </button>

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
                style={{ width: `${100 / itemsPerView}%` }} // ✅ FIXED WIDTH
              >
                <div className={`${itemsPerView === 1 ? "h-40 p-2" : "aspect-square p-4"} bg-gray-50 flex items-center justify-center`}>
                  <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                  <div className="text-lg font-bold text-green-600 mb-4">{product.price}</div>
                  <div className="flex gap-2">
                    <Button className="flex-1 text-sm py-2">Buy Now</Button>
                    <Button variant="outline" className="flex-1 text-sm py-2 bg-transparent">Add to Cart</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Dots */}
      <div className="flex justify-center mt-6 gap-2 lg:hidden">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${currentIndex === index ? "bg-green-600" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
