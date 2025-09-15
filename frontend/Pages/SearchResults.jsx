import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Heart, ShoppingCart } from "lucide-react";
import { useAddToCart } from "../src/hooks/useAddToCart";

export default function SearchResults() {
  const query = new URLSearchParams(useLocation().search).get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { handleAddToCart, toast, showLogin, setShowLogin, handleLoginSuccess } = useAddToCart();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/search/query?q=${encodeURIComponent(query)}`
        );

        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch products. Please try again.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50">
          {toast}
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />
      )}

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Results for "<span className="text-orange-600">{query}</span>"
      </h2>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500">No results found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((p) => {
            const defaultImage = p.images?.[0]?.url || "/placeholder.jpg";
            const hoverImage = p.images?.[1]?.url || defaultImage;
            const hasDiscount = p.discountPrice && p.discountPrice < p.price;

            return (
              <div key={p._id} className="relative bg-white rounded-md p-2 sm:p-3 hover:shadow transition">
                {/* Heart Icon */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 text-gray-400 hover:text-red-500"
                >
                  <Heart size={12} />
                </button>

                {/* Clickable content */}
                <Link to={`/product/${p._id}`}>
                  <img
                    src={defaultImage}
                    alt={p.name}
                    className="w-full h-28 sm:h-32 object-contain mb-1 sm:mb-2 transition-all duration-300"
                    onMouseEnter={(e) => (e.currentTarget.src = hoverImage)}
                    onMouseLeave={(e) => (e.currentTarget.src = defaultImage)}
                  />
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-800 truncate">{p.brand}</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 truncate">{p.name}</p>
                  <div className="flex items-center gap-1 sm:gap-2 mt-1">
                    {hasDiscount ? (
                      <>
                        <span className="text-gray-400 line-through text-[10px] sm:text-xs">৳ {p.price}</span>
                        <span className="text-red-600 font-semibold text-xs sm:text-sm">৳ {p.discountPrice}</span>
                      </>
                    ) : (
                      <span className="text-red-600 font-semibold text-xs sm:text-sm">৳ {p.price}</span>
                    )}
                  </div>
                </Link>

                {/* Add to Cart */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart(p._id);
                  }}
                  className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-black text-white p-1 rounded"
                >
                  <ShoppingCart size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
