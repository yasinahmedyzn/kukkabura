import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function AdminTopSellingProduct() {
  const [form, setForm] = useState({
    brand: "",
    name: "",
    price: "",
    image: null,
    hoverImage: null,
  });
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputMain = useRef(null);
  const fileInputHover = useRef(null);

  // Fetch existing products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/top-products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Upload new product
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.brand || !form.name || !form.price || !form.image || !form.hoverImage) {
      setMessage("Please fill in all fields and select both images.");
      return;
    }

    const formData = new FormData();
    formData.append("brand", form.brand);
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("image", form.image);
    formData.append("hoverImage", form.hoverImage);

    try {
      setUploading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/top-products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Product added!");
      setForm({ brand: "", name: "", price: "", image: null, hoverImage: null });
      fileInputMain.current.value = null;
      fileInputHover.current.value = null;
      fetchProducts();
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("❌ Failed to add product.");
    } finally {
      setUploading(false);
    }
  };

  // Delete a product
  const handleDelete = async (product) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/top-products/${product._id}`, {
        data: {
          imagePublicId: product.imagePublicId,
          hoverImagePublicId: product.hoverImagePublicId,
        },
      });
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto py-4">
        {/* Upload Form */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Add Top Selling Product</h2>

          {message && <p className="mb-3 text-xs text-gray-700">{message}</p>}

          <form onSubmit={handleUpload} className="space-y-2 text-sm">
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-200"
            />

            {/* Main Image */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Main Image:</label>
              <button
                type="button"
                onClick={() => fileInputMain.current.click()}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Choose
              </button>
              <input
                type="file"
                ref={fileInputMain}
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              {form.image && <span className="text-xs text-gray-500 truncate">{form.image.name}</span>}
            </div>

            {/* Hover Image */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Hover Image:</label>
              <button
                type="button"
                onClick={() => fileInputHover.current.click()}
                className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
              >
                Choose
              </button>
              <input
                type="file"
                ref={fileInputHover}
                name="hoverImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              {form.hoverImage && (
                <span className="text-xs text-gray-500 truncate">{form.hoverImage.name}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              {uploading ? "Uploading..." : "Add Product"}
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="mt-4 bg-white shadow rounded-lg p-3">
          <h3 className="text-sm font-semibold mb-2">Existing Products</h3>
          <div className="grid grid-cols-2 gap-2">
            {products.map((p) => (
              <div key={p._id} className="relative border rounded p-2 text-xs">

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(p)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 z-10"
                >
                  X
                </button>

                <div className="relative group">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-24 object-contain transition-opacity duration-300 group-hover:opacity-0"
                  />
                  <img
                    src={p.hoverImageUrl}
                    alt={p.name + " hover"}
                    className="absolute top-0 left-0 w-full h-24 object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>
                <h4 className="font-medium mt-1">{p.name}</h4>
                <p className="text-gray-500">{p.brand}</p>
                <p className="text-blue-600 font-bold">${p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
