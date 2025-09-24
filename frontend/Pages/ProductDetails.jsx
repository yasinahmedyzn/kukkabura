import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Heart, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCart } from "../src/context/CartContext";   // ✅ cart context
import { AuthContext } from "../src/context/AuthContext"; // ✅ auth context

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [openSections, setOpenSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);

  // 🔹 Fetch product details
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setMainImgIdx(res.data.thumbnailIndex || 0);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // 🔹 Add to Cart Handler
  const handleAddToCart = async () => {
    if (!user) {
      setToast("Please login to add items to cart");
      setTimeout(() => setToast(null), 2000);
      return;
    }

    await addToCart(product._id, 1);
    setToast("Item added to cart!");
    setTimeout(() => setToast(null), 2000);
  };

  // 🔹 Section toggle
  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center p-4 text-red-600">{error}</p>;
  if (!product) return <p className="text-center p-4">No product found</p>;

  const discountPercent =
    product.price && product.discountPrice < product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
      {/* ✅ Toast */}
      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50">
          {toast}
        </div>
      )}

      {/* ---------------- Left - Product Images ---------------- */}
      <div className="relative">
        {/* Main Image */}
        <div className="w-full aspect-square bg-gray-50 rounded-lg shadow overflow-hidden">
          <img
            src={product.images?.[mainImgIdx]?.url || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Arrows */}
        {mainImgIdx > 0 && (
          <button
            onClick={() => setMainImgIdx((i) => Math.max(i - 1, 0))}
            className="absolute top-1/2 left-1 md:left-2 -translate-y-1/2 bg-white shadow rounded-full p-1.5 md:p-2 hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
        {mainImgIdx < (product.images?.length || 1) - 1 && (
          <button
            onClick={() => setMainImgIdx((i) => Math.min(i + 1, product.images.length - 1))}
            className="absolute top-1/2 right-1 md:right-2 -translate-y-1/2 bg-white shadow rounded-full p-1.5 md:p-2 hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}

        {/* Thumbnails */}
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {product.images?.map((img, i) => (
            <div
              key={i}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border cursor-pointer flex-shrink-0 ${
                mainImgIdx === i ? "border-red-500 bg-gray-100" : "border-gray-200"
              }`}
              onClick={() => setMainImgIdx(i)}
            >
              <img src={img.url} alt="thumb" className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- Right - Product Info ---------------- */}
      <div>
        {/* Breadcrumb */}
        <p className="text-xs md:text-sm text-gray-400 mb-2 flex flex-wrap gap-1">
          <Link to="/" className="hover:text-gray-600">Home</Link> /
          <span className="text-gray-700">{product.name}</span>
        </p>

        {/* Title + Brand */}
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">{product.name}</h1>
        <p className="text-xs md:text-sm text-gray-500 mb-3">{product.brand}</p>

        {/* Price */}
        <div className="flex items-center gap-2 md:gap-3 mt-2">
          {product.discountPrice && product.discountPrice < product.price ? (
            <>
              <span className="text-lg md:text-2xl font-semibold text-red-600">
                ৳{product.discountPrice}
              </span>
              <span className="line-through text-gray-400 text-sm md:text-base">
                ৳{product.price}
              </span>
              <span className="bg-red-100 text-red-600 text-xs md:text-sm px-1.5 md:px-2 py-0.5 rounded">
                -{discountPercent}%
              </span>
            </>
          ) : (
            <span className="text-lg md:text-2xl font-semibold text-red-600">
              ৳{product.price}
            </span>
          )}
        </div>

        {/* Highlights */}
        {product.highlights?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
            {product.highlights.map((h, i) => (
              <div
                key={i}
                className="text-xs md:text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-700"
              >
                {h}
              </div>
            ))}
          </div>
        )}

        {/* Stock + Cart */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-green-600 text-xs md:text-sm">✓ In Stock</span>
          <button
            onClick={handleAddToCart}
            className="flex-1 md:flex-none px-4 md:px-6 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg shadow font-medium text-sm md:text-base"
          >
            Add to Cart
          </button>
          <button className="p-1.5 md:p-2 border rounded-full hover:bg-gray-100">
            <Heart className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
          </button>
        </div>

        {/* Collapsible Sections */}
        <div className="mt-6 md:mt-8 space-y-3">
          {[
            { key: "description", label: "Description", content: product.description },
            { key: "featuresDetails", label: "Features & Details", content: product.featuresDetails },
            { key: "ingredients", label: "Ingredients", content: product.ingredients },
            { key: "activeIngredients", label: "Active Ingredient(s)", content: product.activeIngredients },
            { key: "directions", label: "Directions", content: product.directions },
            { key: "benefits", label: "Benefits", content: product.benefits },
            { key: "recommendedUses", label: "Recommended Uses For Product", content: product.recommendedUses },
          ].map((section) => (
            <div key={section.key} className="border-b border-gray-200/70 pb-2">
              <button
                onClick={() => toggleSection(section.key)}
                className="flex items-center justify-between w-full text-left font-medium text-gray-700 text-sm md:text-base"
              >
                {section.label}
                <Plus
                  className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${
                    openSections[section.key] ? "rotate-45" : ""
                  }`}
                />
              </button>
              {openSections[section.key] && (
                <div className="mt-2 text-xs md:text-sm text-gray-600 leading-relaxed">
                  {Array.isArray(section.content) ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {section.content.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
