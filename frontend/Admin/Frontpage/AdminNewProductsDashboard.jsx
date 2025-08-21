import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function AdminNewProduct() {
  const [form, setForm] = useState({
    brand: "",
    name: "",
    price: "",
    category: "",
    image: null,
    hoverImage: null,
  });
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", category: "", image: null, hoverImage: null });

  const fileInputMain = useRef(null);
  const fileInputHover = useRef(null);

  const fileEditMain = useRef(null);
  const fileEditHover = useRef(null);

  // Fetch existing products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/new-products`);
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

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Upload new product
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.brand || !form.name || !form.price || !form.category || !form.image || !form.hoverImage) {
      setMessage("Please fill in all fields and select both images.");
      return;
    }

    const formData = new FormData();
    formData.append("brand", form.brand);
    formData.append("name", form.name);
    formData.append("price", form.price);
    form.category
      .split(",")
      .map(c => c.trim())
      .filter(Boolean)
      .forEach(c => formData.append("category[]", c));
    formData.append("image", form.image);
    formData.append("hoverImage", form.hoverImage);

    try {
      setUploading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/new-products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Product added!");
      setForm({ brand: "", name: "", price: "", category: "", image: null, hoverImage: null });
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/new-products/${product._id}`, {
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

  // Start editing a product
  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      category: Array.isArray(product.category) ? product.category.join(", ") : (product.category || "")
    });
  };

  // Save edited product
  const handleSaveEdit = async (productId) => {
    try {
      const data = new FormData();
      data.append("name", editForm.name);
      data.append("price", editForm.price);
      if (editForm.category) {
        editForm.category
          .split(",")
          .map(c => c.trim())
          .filter(Boolean)
          .forEach(c => data.append("category[]", c));
      }
      if (editForm.image) data.append("image", editForm.image);
      if (editForm.hoverImage) data.append("hoverImage", editForm.hoverImage);

      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/new-products/${productId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? res.data : p))
      );

      setEditingProductId(null);
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to update product.");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingProductId(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto py-4">
        {/* Upload Form */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Add New Product</h2>

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
              type="text"
              name="category"
              placeholder="Categories (comma separated)"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-1 py-1 mb-1 text-xs focus:outline-none focus:ring focus:ring-blue-200"
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
                  ✕
                </button>

                {/* Edit Icon */}
                <button
                  onClick={() => handleEditClick(p)}
                  className="absolute top-1 right-7 bg-yellow-400 text-white rounded-full p-1 text-xs hover:bg-yellow-500 z-10"
                >
                  ✎
                </button>

                {editingProductId === p._id ? (
                  // Edit Mode
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="w-full border rounded px-1 py-1 mb-1 text-xs focus:outline-none focus:ring focus:ring-blue-200"
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      className="w-full border rounded px-1 py-1 mb-1 text-xs focus:outline-none focus:ring focus:ring-blue-200"
                    />

                    {/* Main Image */}
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        type="button"
                        onClick={() => fileEditMain.current.click()}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Choose Main Image
                      </button>
                      <input
                        type="file"
                        ref={fileEditMain}
                        name="image"
                        accept="image/*"
                        onChange={(e) => setEditForm((prev) => ({ ...prev, image: e.target.files[0] }))}
                        className="hidden"
                      />
                      {editForm.image && <span className="text-xs text-gray-500 truncate">{editForm.image.name}</span>}
                    </div>

                    {/* Hover Image */}
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        type="button"
                        onClick={() => fileEditHover.current.click()}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                      >
                        Choose Hover Image
                      </button>
                      <input
                        type="file"
                        ref={fileEditHover}
                        name="hoverImage"
                        accept="image/*"
                        onChange={(e) => setEditForm((prev) => ({ ...prev, hoverImage: e.target.files[0] }))}
                        className="hidden"
                      />
                      {editForm.hoverImage && <span className="text-xs text-gray-500 truncate">{editForm.hoverImage.name}</span>}
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleSaveEdit(p._id)}
                        className="flex-1 bg-green-500 text-white text-xs rounded py-1 hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-400 text-white text-xs rounded py-1 hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <>
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
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}