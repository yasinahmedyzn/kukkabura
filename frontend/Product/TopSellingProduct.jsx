"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { AuthContext } from "../src/context/AuthContext";
import { useCart } from "../src/context/CartContext";
import LoginModal from "../Auth/loginmodal";
import "./styles.css";

export default function TopSellingProduct() {
  const [products, setProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingProductId, setPendingProductId] = useState(null);

  const scrollContainerRef = useRef(null);
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);

  const productsPerPageDesktop = 5;
  const productsPerPageMobile = 2;

  // 🔹 Fetch only "top" products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        // Safe filter: works if productType is array OR string
        const topProducts = data.products.filter((p) => {
          if (Array.isArray(p.productType)) {
            return p.productType.includes("top");
          }
          return p.productType === "top";
        });

        setProducts(topProducts);
      } catch (error) {
        console.error(error);
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
    container.scrollBy({
      left: productWidth * productsPerPage * direction,
      behavior: "smooth",
    });
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) newFavorites.delete(productId);
    else newFavorites.add(productId);
    setFavorites(newFavorites);
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      setPendingProductId(productId);
      setShowLogin(true);
      return;
    }

    await addToCart(productId, 1);
    setToast("Item added to cart successfully!");
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 relative">
      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50">
          {toast}
        </div>
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={async () => {
            setShowLogin(false);
            if (pendingProductId) {
              await addToCart(pendingProductId, 1);
              setToast("Item added to cart successfully!");
              setPendingProductId(null);
              setTimeout(() => setToast(null), 2000);
            }
          }}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-3">
          Top Selling Products
        </h2>
        <Link
          to="/product"
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          View all
        </Link>
      </div>

      {/* Arrows */}
      <button
        onClick={() => scrollByPage(-1)}
        className="hidden md:flex absolute top-1/2 left-2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      <button
        onClick={() => scrollByPage(1)}
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
                onAddToCart={() => handleAddToCart(product._id)}
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
  const [hoverCart, setHoverCart] = useState(false);

  // 🔹 Safe image fallback
  const mainImage =
    product.images?.[product.thumbnailIndex]?.url || product.images?.[0]?.url;

  return (
    <div
      className="bg-white rounded-lg border border-gray-100 p-3 md:p-4 relative group hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* ❤️ Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
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

      {/* 🖼️ Product Image */}
      <Link to={`/product/${product._id}`} className="block relative mb-3">
        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
          <img
            src={mainImage}
            alt={product.name}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
          {product.images?.[1]?.url && (
            <img
              src={product.images[1].url}
              alt={`${product.name} - alternate view`}
              className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </Link>

      {/* 📝 Product Details */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-900">{product.brand}</p>

        <Link to={`/product/${product._id}`}>
          <h3 className="text-xs md:text-sm text-gray-700 line-clamp-2 leading-tight hover:underline">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-red-600">
            ৳ {product.price}
          </span>

          {/* 🛒 Add to Cart */}
          <button
            onMouseEnter={() => setHoverCart(true)}
            onMouseLeave={() => setHoverCart(false)}
            onTouchStart={() => setHoverCart(true)}
            onTouchEnd={() => setHoverCart(false)}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onAddToCart();
            }}
            className={`p-1.5 rounded-md transition-colors ${
              hoverCart
                ? "bg-red-500 text-white"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            <ShoppingCart className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
