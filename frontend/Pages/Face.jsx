import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, ShoppingCart } from "lucide-react";
import { useAddToCart } from "../src/hooks/useAddToCart"; // ✅ import custom hook
import LoginModal from "../Auth/loginForm";           // ✅ import login modal

const FaceProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Reusable add-to-cart logic
  const { toast, showLogin, setShowLogin, handleAddToCart, handleLoginSuccess } = useAddToCart();

  useEffect(() => {
    const fetchFaceProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/all/products`,
          {
            params: { category: "face" }, // Fetch only face products
          }
        );
        setProducts(res.data.products || []);
      } catch (error) {
        console.error("Error fetching Face products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaceProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      {/* ✅ Toast notification */}
      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50">
          {toast}
        </div>
      )}

      {/* ✅ Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm sm:text-lg font-semibold text-gray-800 mb-1">
          Face Products
        </h2>
        <p className="text-sm text-gray-600">
          {loading
            ? "Loading..."
            : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.length ? (
          products.map((p) => {
            const defaultImage = p.imageUrl || "/placeholder.jpg";
            const hoverImage = p.hoverImageUrl || p.imageUrl;

            return (
              <div
                key={p._id}
                className="relative bg-white rounded-md p-2 sm:p-3 hover:shadow transition"
              >
                {/* Heart Icon */}
                <button className="absolute top-1 right-1 sm:top-2 sm:right-2 text-gray-400 hover:text-red-500">
                  <Heart size={12} />
                </button>

                {/* Image */}
                <img
                  src={defaultImage}
                  alt={p.name}
                  className="w-full h-28 sm:h-32 object-contain mb-1 sm:mb-2 transition-all duration-300"
                  onMouseEnter={(e) => (e.currentTarget.src = hoverImage)}
                  onMouseLeave={(e) => (e.currentTarget.src = defaultImage)}
                />

                {/* Brand */}
                <p className="text-[10px] sm:text-xs font-semibold text-gray-800 truncate">
                  {p.brand}
                </p>

                {/* Name */}
                <p className="text-[10px] sm:text-xs text-gray-600 truncate">
                  {p.name}
                </p>

                {/* Price */}
                <div className="flex items-center gap-1 sm:gap-2 mt-1">
                  {p.discprice ? (
                    <>
                      <span className="text-gray-400 line-through text-[10px] sm:text-xs">
                        ৳ {p.price}
                      </span>
                      <span className="text-red-600 font-semibold text-xs sm:text-sm">
                        ৳ {p.discprice}
                      </span>
                    </>
                  ) : (
                    <span className="text-red-600 font-semibold text-xs sm:text-sm">
                      ৳ {p.price}
                    </span>
                  )}
                </div>

                {/* Cart Icon */}
                <button
                  className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-black text-white p-1 rounded hover:bg-gray-800"
                  onClick={() => handleAddToCart(p._id)} // ✅ Add to cart
                >
                  <ShoppingCart size={12} />
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">
            {loading ? "Loading..." : "No Face products available"}
          </p>
        )}
      </div>
    </div>
  );
};

export default FaceProducts;
