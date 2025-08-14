"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import "./styles.css";
import { useCart } from "../src/context/CartContext";

export default function Newarrival() {
  const [products, setProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const scrollContainerRef = useRef(null);

  const { addToCart } = useCart();

  const productsPerPageDesktop = 5;
  const productsPerPageMobile = 2;

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/new-products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const scrollByPage = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const productsPerPage = isMobile
      ? productsPerPageMobile
      : productsPerPageDesktop;
    const productWidth = container.clientWidth / productsPerPage;
    const scrollAmount = productWidth * productsPerPage * direction;

    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-3">
          New Arrival Product
        </h2>
        <button className="text-sm text-gray-600 hover:text-gray-900 underline">
          View all
        </button>
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={() => scrollByPage(-1)}
        aria-label="Scroll left"
        className="hidden md:flex absolute top-1/2 left-2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      <button
        onClick={() => scrollByPage(1)}
        aria-label="Scroll right"
        className="hidden md:flex absolute top-1/2 right-2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Product List */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scroll-smooth hide-scrollbar"
      >
        <div className="flex gap-4">
          {products.map((product) => (
            <div key={product._id} className="flex-shrink-0 w-1/2 md:w-[20%]">
              <ProductCard
                product={product}
                isHovered={hoveredProduct === product._id}
                isFavorite={favorites.has(product._id)}
                onHover={() => setHoveredProduct(product._id)}
                onLeave={() => setHoveredProduct(null)}
                onToggleFavorite={() => toggleFavorite(product._id)}
                // ✅ Send only productId & quantity to backend
                onAddToCart={() => addToCart(product._id, 1)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  isHovered,
  isFavorite,
  onHover,
  onLeave,
  onToggleFavorite,
  onAddToCart,
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 md:p-4 relative group hover:shadow-md transition-shadow duration-200 cursor-pointer">
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-2 right-2 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Heart
          className={`w-4 h-4 ${
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      {/* Product Image */}
      <div
        className="relative mb-3"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
          {product.hoverImageUrl && (
            <img
              src={product.hoverImageUrl}
              alt={`${product.name} - alternate view`}
              className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-900">{product.brand}</p>
        <h3 className="text-xs md:text-sm text-gray-700 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-red-600">
            ৳ {product.price}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="p-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <ShoppingCart className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
