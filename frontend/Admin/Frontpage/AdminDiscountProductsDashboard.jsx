import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function AdminDiscountProduct() {
  const [form, setForm] = useState({
    brand: "",
    name: "",
    price: "",
    discprice: "",
    category: "",
    images: [],
    hoverImage: null,
    thumbnailIndex: 0,
  });
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    discprice: "",
    category: "",
    images: [],
    hoverImage: null,
    thumbnailIndex: 0,
  });
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalThumbnailIndex, setModalThumbnailIndex] = useState(0);
  const [modalProductId, setModalProductId] = useState(null);

  const fileInputImages = useRef(null);
  const fileInputHover = useRef(null);

  const fileEditImages = useRef(null);
  const fileEditHover = useRef(null);

  // Fetch existing products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/discount-products`);
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
    if (name === "images" && files) {
      setForm((prev) => ({
        ...prev,
        images: Array.from(files),
        thumbnailIndex: 0,
      }));
    } else if (name === "hoverImage" && files) {
      setForm((prev) => ({ ...prev, hoverImage: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle thumbnail selection
  const handleThumbnailSelect = (idx) => {
    setForm((prev) => ({ ...prev, thumbnailIndex: idx }));
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images" && files) {
      setEditForm((prev) => ({
        ...prev,
        images: Array.from(files),
        thumbnailIndex: 0,
      }));
    } else if (name === "hoverImage" && files) {
      setEditForm((prev) => ({ ...prev, hoverImage: files[0] }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditThumbnailSelect = (idx) => {
    setEditForm((prev) => ({ ...prev, thumbnailIndex: idx }));
  };

  // Upload new product
  const handleUpload = async (e) => {
    e.preventDefault();
    if (
      !form.brand ||
      !form.name ||
      !form.category ||
      !form.price ||
      !form.discprice ||
      form.images.length === 0 ||
      !form.hoverImage
    ) {
      setMessage("Please fill in all fields and select images.");
      return;
    }

    const formData = new FormData();
    formData.append("brand", form.brand);
    formData.append("name", form.name);
    form.category
      .split(",")
      .map((c) => c.trim())
      .forEach((c) => formData.append("category[]", c));
    formData.append("price", form.price);
    formData.append("discprice", form.discprice);
    form.images.forEach((img) => formData.append("images", img));
    formData.append("thumbnailIndex", form.thumbnailIndex);
    formData.append("hoverImage", form.hoverImage);

    try {
      setUploading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/discount-products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Product added!");
      setForm({
        brand: "",
        name: "",
        price: "",
        discprice: "",
        category: "",
        images: [],
        hoverImage: null,
        thumbnailIndex: 0,
      });
      fileInputImages.current.value = null;
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/discount-products/${product._id}`, {
        data: {
          imagesPublicIds: product.images?.map((img) => img.publicId),
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
      discprice: product.discprice,
      category: Array.isArray(product.category) ? product.category.join(", ") : product.category || "",
      images: [],
      hoverImage: null,
      thumbnailIndex: product.thumbnailIndex || 0,
    });
  };

  // Save edited product
  const handleSaveEdit = async (productId) => {
    try {
      const data = new FormData();
      data.append("name", editForm.name);
      data.append("price", editForm.price);
      data.append("discprice", editForm.discprice);
      if (editForm.category) {
        editForm.category
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
          .forEach((c) => data.append("category[]", c));
      }
      editForm.images.forEach((img) => data.append("images", img));
      data.append("thumbnailIndex", editForm.thumbnailIndex);
      if (editForm.hoverImage) data.append("hoverImage", editForm.hoverImage);

      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/discount-products/${productId}`, data, {
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

  // Show modal with all images for a product
  const handleShowImagesModal = (product) => {
    setModalImages(product.images || []);
    setModalThumbnailIndex(product.thumbnailIndex || 0);
    setModalProductId(product._id);
    setShowImagesModal(true);
  };

  // Set thumbnail from modal
  const handleSetThumbnailFromModal = async (idx) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/discount-products/${modalProductId}`,
        { thumbnailIndex: idx },
        { headers: { "Content-Type": "application/json" } }
      );
      setModalThumbnailIndex(idx);
      setShowImagesModal(false);
      fetchProducts();
    } catch (err) {
      alert("Failed to set thumbnail.");
    }
  };

  // Delete image from modal
  const handleDeleteImageFromModal = async (imgIdx) => {
    const imageToDelete = modalImages[imgIdx];
    if (!imageToDelete) return;
    if (!confirm("Delete this image?")) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/discount-products/${modalProductId}`, {
        deleteImagePublicId: imageToDelete.publicId,
      });
      setShowImagesModal(false);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete image.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto py-4">
        {/* Upload Form */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Add Discount Product</h2>

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
            <input
              type="number"
              name="discprice"
              placeholder="Discount Price"
              value={form.discprice}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-200"
            />

            {/* Images Upload */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Product Images:</label>
              <button
                type="button"
                onClick={() => fileInputImages.current.click()}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Choose
              </button>
              <input
                type="file"
                ref={fileInputImages}
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="hidden"
              />
              {/* Preview and thumbnail selector */}
              <div className="flex gap-2 mt-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview-${idx}`}
                      className={`w-16 h-16 object-cover border ${form.thumbnailIndex === idx ? "border-blue-500" : "border-gray-300"}`}
                      onClick={() => handleThumbnailSelect(idx)}
                      style={{ cursor: "pointer" }}
                    />
                    {form.thumbnailIndex === idx && (
                      <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">Thumbnail</span>
                    )}
                  </div>
                ))}
              </div>
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
                      placeholder="Main Price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      className="w-full border rounded px-1 py-1 mb-1 text-xs focus:outline-none focus:ring focus:ring-blue-200"
                    />
                    <input
                      type="number"
                      name="discprice"
                      placeholder="Discount Price"
                      value={editForm.discprice}
                      onChange={handleEditChange}
                      className="w-full border rounded px-1 py-1 mb-1 text-xs focus:outline-none focus:ring focus:ring-blue-200"
                    />

                    {/* Images Upload */}
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        type="button"
                        onClick={() => fileEditImages.current.click()}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Choose Images
                      </button>
                      <input
                        type="file"
                        ref={fileEditImages}
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleEditChange}
                        className="hidden"
                      />
                      <div className="flex gap-2 mt-2">
                        {editForm.images.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`edit-preview-${idx}`}
                              className={`w-12 h-12 object-cover border ${editForm.thumbnailIndex === idx ? "border-blue-500" : "border-gray-300"}`}
                              onClick={() => handleEditThumbnailSelect(idx)}
                              style={{ cursor: "pointer" }}
                            />
                            {editForm.thumbnailIndex === idx && (
                              <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">Thumbnail</span>
                            )}
                          </div>
                        ))}
                      </div>
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
                        onChange={handleEditChange}
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
                      {Array.isArray(p.images) && p.images.length > 0 ? (
                        <img
                          src={p.images[p.thumbnailIndex || 0]?.url}
                          alt={p.name}
                          className="w-full h-24 object-contain transition-opacity duration-300 group-hover:opacity-0"
                        />
                      ) : (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-24 object-contain transition-opacity duration-300 group-hover:opacity-0"
                        />
                      )}
                      <img
                        src={p.hoverImageUrl}
                        alt={p.name + " hover"}
                        className="absolute top-0 left-0 w-full h-24 object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    </div>
                    <h4 className="font-medium mt-1">{p.name}</h4>
                    <p className="text-gray-500">{p.brand}</p>
                    <p className="text-blue-600 font-bold">${p.price}</p>
                    {/* Images uploaded button */}
                    <button
                      type="button"
                      className="text-xs text-blue-700 underline mt-1"
                      onClick={() => handleShowImagesModal(p)}
                    >
                      Images uploaded: {Array.isArray(p.images) ? p.images.length : 0}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Images Modal */}
        {showImagesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-80">
              <h4 className="font-semibold mb-2 text-sm">Product Images</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {modalImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img.url}
                      alt={`modal-img-${idx}`}
                      className={`w-16 h-16 object-cover border ${modalThumbnailIndex === idx ? "border-blue-500" : "border-gray-300"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSetThumbnailFromModal(idx)}
                    />
                    {modalThumbnailIndex === idx && (
                      <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">Thumbnail</span>
                    )}
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1"
                      onClick={() => handleDeleteImageFromModal(idx)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="w-full py-1 bg-gray-600 text-white text-xs rounded"
                onClick={() => setShowImagesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}