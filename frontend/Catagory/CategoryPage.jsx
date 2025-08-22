import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, ShoppingCart, ChevronDown, ChevronUp, Filter } from "lucide-react";

const CategoryProducts = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(false);

  // price slider state
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  // brand dropdown
  const [brandOpen, setBrandOpen] = useState(false);

  // mobile filters open
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/all/categories`)
      .then((res) => setCategories(res.data.categories || []))
      .catch((err) => console.error("Error fetching categories", err));
  }, []);

  // Fetch brands
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/all/brands`)
      .then((res) => setBrands(res.data.brands || []))
      .catch((err) => console.error("Error fetching brands", err));
  }, []);

  // Fetch products with filters
  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/all/products`,
          {
            params: {
              category: selectedCategory || undefined,
              brand: selectedBrand || undefined,
              sort,
              minPrice,
              maxPrice,
            },
          }
        );
        setProducts(res.data.products || []);
      } catch (error) {
        console.error("Error fetching products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedBrand, sort, minPrice, maxPrice]);

  return (
    <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 max-w-6xl">
      {/* Sidebar Filters */}
      <aside className={`w-full md:w-60 bg-gray-50 rounded-lg p-3 md:p-4 space-y-4 shadow-sm border border-gray-200 ${mobileFilterOpen ? "block" : "hidden md:block"}`}>
        {/* Categories */}
        <div>
          <h3 className="text-sm font-semibold mb-1">Categories</h3>
          {categories.length ? (
            categories.map((cat, i) => (
              <label key={i} className="flex items-center space-x-2 text-xs md:text-sm mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                  className="h-3 w-3 md:h-4 md:w-4"
                />
                <span>{cat}</span>
              </label>
            ))
          ) : (
            <p className="text-xs text-gray-500">No categories</p>
          )}
        </div>

        {/* Brands Dropdown */}
        <div>
          <button
            onClick={() => setBrandOpen(!brandOpen)}
            className="flex items-center justify-between w-full text-xs md:text-sm font-semibold mb-1 md:mb-2"
          >
            Brands {brandOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {brandOpen && (
            <div className="space-y-1 pl-2">
              {brands.length ? (
                brands.map((b, i) => (
                  <label key={i} className="flex items-center space-x-2 text-xs md:text-sm mb-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrand === b}
                      onChange={() => setSelectedBrand(selectedBrand === b ? "" : b)}
                      className="h-3 w-3 md:h-4 md:w-4"
                    />
                    <span>{b}</span>
                  </label>
                ))
              ) : (
                <p className="text-xs text-gray-500">No brands</p>
              )}
            </div>
          )}
        </div>

        {/* Price Range Slider */}
        <div>
          <h3 className="text-sm font-semibold mb-1">Filter by Price</h3>

          {/* Min & Max Labels */}
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>৳{minPrice}</span>
            <span>৳{maxPrice}</span>
          </div>

          <div className="relative w-full h-4">
            {/* Full track */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 rounded"></div>

            {/* Filled track */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-red-300 rounded"
              style={{
                left: `${(minPrice / 10000) * 100}%`,
                right: `${100 - (maxPrice / 10000) * 100}%`,
              }}
            ></div>

            {/* Min Handle */}
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={minPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val <= maxPrice) setMinPrice(val);
              }}
              className="absolute w-full h-4 appearance-none bg-transparent pointer-events-none
        focus:outline-none focus:ring-0
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-400
        [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white
        [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
            />

            {/* Max Handle */}
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= minPrice) setMaxPrice(val);
              }}
              className="absolute w-full h-4 appearance-none bg-transparent pointer-events-none
        focus:outline-none focus:ring-0
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-400
        [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white
        [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
            />
          </div>
        </div>


      </aside>

      {/* Mobile Filter Button */}
      <div className="md:hidden flex justify-end mb-2">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex items-center gap-1 text-sm font-semibold bg-gray-200 px-3 py-1 rounded"
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Products Section */}
      <main className="flex-1">
        {/* Top bar with sort + product count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
          <p className="text-sm text-gray-600">
            {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border rounded p-1"
          >
            <option value="latest">Latest</option>
            <option value="priceLowHigh">Price: Low → High</option>
            <option value="priceHighLow">Price: High → Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.length ? (
            products.map((p) => {
              const defaultImage = p.imageUrl || "/placeholder.jpg";
              const hoverImage = p.hoverImageUrl || p.imageUrl;

              return (
                <div key={p._id} className="relative bg-white rounded-md p-2 sm:p-3 hover:shadow transition">
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
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-800 truncate">{p.brand}</p>

                  {/* Name */}
                  <p className="text-[10px] sm:text-xs text-gray-600 truncate">{p.name}</p>

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
                  <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-black text-white p-1 rounded">
                    <ShoppingCart size={12} />
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">{loading ? "Loading..." : "No products available"}</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryProducts;
