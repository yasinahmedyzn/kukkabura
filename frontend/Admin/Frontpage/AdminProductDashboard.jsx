import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const categoriesList = [
  "makeup", "fragrance", "skin-care", "hair", "tools", "bath", "face", "eyes",
  "giftbox", "accessories", "lip", "baby-care", "clothing", "shoes", "hats", "watches", "jewelry", "sunglasses",
];
const productTypes = ["regular", "new", "discount", "top"];

export default function AdminProductDashboard() {
  const [form, setForm] = useState({
    brand: "", name: "", price: "", discountPercentage: 0, category: [], productType: [], images: [], thumbnailIndex: 0,
  });
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({
    brand: "", name: "", price: "", discountPercentage: 0, category: [], productType: [], images: [], thumbnailIndex: 0,
  });
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalThumbnailIndex, setModalThumbnailIndex] = useState(0);
  const [modalProductId, setModalProductId] = useState(null);

  const fileInputImages = useRef(null);
  const fileEditImages = useRef(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  };

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (name === "images" && files) {
      setForm(prev => ({ ...prev, images: Array.from(files), thumbnailIndex: 0 }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditChange = (e) => {
    const { name, files, value } = e.target;
    if (name === "images" && files) {
      setEditForm(prev => ({ ...prev, images: Array.from(files), thumbnailIndex: 0 }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleSelection = (key, value, isEdit = false) => {
    const setter = isEdit ? setEditForm : setForm;
    const current = isEdit ? editForm : form;
    if (current[key].includes(value)) {
      setter({ ...current, [key]: current[key].filter(v => v !== value) });
    } else {
      setter({ ...current, [key]: [...current[key], value] });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const { brand, name, price, discountPercentage, category, productType, images } = form;
    if (!brand || !name || !price || !category.length || !productType.length || !images.length) {
      setMessage("Please fill all fields and upload at least one image.");
      return;
    }
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value) && key !== "images") value.forEach(v => formData.append(key, v));
      else if (key === "images") value.forEach(img => formData.append("images", img));
      else formData.append(key, value);
    });
    try {
      setUploading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Product added successfully!");
      setForm({ brand: "", name: "", price: "", discountPercentage: 0, category: [], productType: [], images: [], thumbnailIndex: 0 });
      fileInputImages.current.value = null;
      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add product.");
    } finally { setUploading(false); }
  };

  const handleDelete = async (product) => {
    if (!confirm("Are you sure to delete this product?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${product._id}`);
      setProducts(prev => prev.filter(p => p._id !== product._id));
    } catch (err) { console.error(err); alert("Failed to delete product."); }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditForm({
      brand: product.brand,
      name: product.name,
      price: product.price,
      discountPercentage: product.discountPercentage || 0,
      category: Array.isArray(product.category) ? product.category : [product.category],
      productType: Array.isArray(product.productType) ? product.productType : [product.productType],
      images: [],
      thumbnailIndex: product.thumbnailIndex || 0,
    });
  };

  const handleSaveEdit = async (id) => {
    const data = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      if (Array.isArray(value) && key !== "images") value.forEach(v => data.append(key, v));
      else if (key === "images") value.forEach(img => data.append("images", img));
      else data.append(key, value);
    });
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProducts(prev => prev.map(p => (p._id === id ? res.data : p)));
      setEditingProductId(null);
    } catch (err) { console.error(err); alert("Failed to update product."); }
  };

  const handleCancelEdit = () => setEditingProductId(null);

  const handleThumbnailSelect = (idx, isEdit = false) => {
    if (isEdit) setEditForm(prev => ({ ...prev, thumbnailIndex: idx }));
    else setForm(prev => ({ ...prev, thumbnailIndex: idx }));
  };

  const handleShowImagesModal = (product) => {
    setModalImages(product.images || []);
    setModalThumbnailIndex(product.thumbnailIndex || 0);
    setModalProductId(product._id);
    setShowImagesModal(true);
  };

  const handleSetThumbnailFromModal = async (idx) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${modalProductId}`, { thumbnailIndex: idx }, { headers: { "Content-Type": "application/json" } });
      setModalThumbnailIndex(idx);
      setShowImagesModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to set thumbnail.");
    }
  };

  const handleDeleteImageFromModal = async (idx) => {
    const img = modalImages[idx];
    if (!img) return;
    if (!confirm("Delete this image?")) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${modalProductId}`, { deleteImagePublicId: img.publicId });
      setShowImagesModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete image.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center p-2">
      <div className="w-full max-w-md space-y-4">

        {/* Add Product */}
        <div className="bg-white shadow rounded-lg p-3">
          <h2 className="text-md font-semibold mb-2">Add Product</h2>
          {message && <p className="mb-1 text-xs text-gray-700">{message}</p>}
          <form onSubmit={handleUpload} className="space-y-2 text-sm">
            <input type="text" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} className="w-full border rounded px-2 py-1 text-xs" />
            <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border rounded px-2 py-1 text-xs" />
            <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="w-full border rounded px-2 py-1 text-xs" />
            <input type="number" name="discountPercentage" placeholder="Discount %" value={form.discountPercentage} onChange={handleChange} className="w-full border rounded px-2 py-1 text-xs" />

            {/* Categories */}
            <h2 className="text-md font-semibold mb-2">Select Category</h2>
            <div className="flex flex-wrap gap-1">
              {categoriesList.map(cat => (
                <div key={cat} onClick={() => toggleSelection("category", cat)} className={`px-2 py-1 rounded text-xs cursor-pointer ${form.category.includes(cat) ? "bg-blue-500 text-white" : "bg-gray-200"}`}>{cat}</div>
              ))}
            </div>

            {/* Product Types */}
            <h2 className="text-md font-semibold mb-2">Product Type</h2>
            <div className="flex flex-wrap gap-1">
              {productTypes.map(type => (
                <div key={type} onClick={() => toggleSelection("productType", type)} className={`px-2 py-1 rounded text-xs cursor-pointer ${form.productType.includes(type) ? "bg-blue-500 text-white" : "bg-gray-200"}`}>{type}</div>
              ))}
            </div>

            {/* Images */}
            <div className="flex flex-col gap-1">
              <button type="button" onClick={() => fileInputImages.current.click()} className="px-2 py-1 bg-blue-500 text-white text-xs rounded w-full">Choose Images</button>
              <input type="file" ref={fileInputImages} name="images" accept="image/*" multiple onChange={handleChange} className="hidden" />
              <div className="flex flex-wrap gap-1 mt-1">
                {form.images.map((img, idx) => (
                  <img key={idx} src={URL.createObjectURL(img)} alt={`preview-${idx}`} className={`w-12 h-12 object-cover border ${form.thumbnailIndex === idx ? "border-blue-500" : "border-gray-300"}`} onClick={() => handleThumbnailSelect(idx)} />
                ))}
              </div>
            </div>

            <button type="submit" disabled={uploading} className="w-full py-1 bg-indigo-600 text-white rounded text-xs">{uploading ? "Uploading..." : "Add Product"}</button>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white shadow rounded-lg p-3">
          <h3 className="text-sm font-semibold mb-2">Existing Products</h3>
          <div className="grid grid-cols-2 gap-3">
            {products.map(p => (
              <div key={p._id} className="relative border rounded-lg p-2 text-xs bg-gray-50 shadow hover:shadow-md transition-shadow duration-200">

                {/* Buttons */}
                <button onClick={() => handleDelete(p)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 z-10">✕</button>
                <button onClick={() => handleEditClick(p)} className="absolute top-1 right-8 bg-yellow-400 text-white rounded-full p-1 text-xs hover:bg-yellow-500 z-10">✎</button>

                {editingProductId === p._id ? (
                  <div className="space-y-1">
                    {/* Edit Form */}
                    <input type="text" name="brand" value={editForm.brand} onChange={handleEditChange} className="w-full border rounded px-1 py-1 text-xs" placeholder="Brand" />
                    <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="w-full border rounded px-1 py-1 text-xs" placeholder="Name" />
                    <input type="number" name="price" value={editForm.price} onChange={handleEditChange} className="w-full border rounded px-1 py-1 text-xs" placeholder="Price" />
                    <input type="number" name="discountPercentage" value={editForm.discountPercentage} onChange={handleEditChange} className="w-full border rounded px-1 py-1 text-xs" placeholder="Discount %" />

                    {/* Categories & Product Types Dropdown */}
                    <select multiple className="w-full border rounded px-1 py-1 text-xs mb-1" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: Array.from(e.target.selectedOptions, option => option.value) })}>
                      {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select multiple className="w-full border rounded px-1 py-1 text-xs mb-1" value={editForm.productType} onChange={e => setEditForm({ ...editForm, productType: Array.from(e.target.selectedOptions, option => option.value) })}>
                      {productTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>

                    {/* Images */}
                    <div className="flex flex-col gap-1">
                      <button type="button" onClick={() => fileEditImages.current.click()} className="px-2 py-1 bg-blue-500 text-white text-xs rounded w-full">Choose Images</button>
                      <input type="file" ref={fileEditImages} name="images" accept="image/*" multiple onChange={handleEditChange} className="hidden" />
                      <div className="flex flex-wrap gap-1 mt-1">
                        {editForm.images.map((img, idx) => (
                          <img key={idx} src={URL.createObjectURL(img)} alt={`edit-${idx}`} className={`w-12 h-12 object-cover border ${editForm.thumbnailIndex === idx ? "border-blue-500" : "border-gray-300"}`} onClick={() => handleThumbnailSelect(idx, true)} />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-1 mt-1">
                      <button onClick={() => handleSaveEdit(p._id)} className="flex-1 bg-green-500 text-white text-xs rounded py-1">Save</button>
                      <button onClick={handleCancelEdit} className="flex-1 bg-gray-400 text-white text-xs rounded py-1">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Product Image */}
                    <div className="relative group w-full h-20">
                      {Array.isArray(p.images) && p.images.length > 0 && (
                        <>
                          <img src={p.images[p.thumbnailIndex || 0]?.url} alt={p.name} className="w-full h-20 object-contain transition-opacity duration-300 group-hover:opacity-0" />
                          {p.images[1] && <img src={p.images[1]?.url} alt={`${p.name} hover`} className="absolute top-0 left-0 w-full h-20 object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100" />}
                        </>
                      )}
                      {p.images.length > 1 && <button type="button" onClick={() => handleShowImagesModal(p)} className="absolute bottom-1 right-1 text-xs bg-blue-500 text-white px-1 rounded">{p.images.length} imgs</button>}
                    </div>

                    {/* Product Info */}
                    <h4 className="font-medium mt-1 truncate">{p.name}</h4>
                    <p className="text-gray-500 truncate">{p.brand}</p>

                    {/* Price + Discount */}
                    <div className="flex gap-1 items-center mt-1">
                      {p.discountPercentage > 0 && (
                        <span className="text-gray-400 line-through text-xs">৳{p.price}</span>
                      )}
                      <span className="text-red-600 font-bold text-sm">
                        ৳{p.discountPercentage > 0 ? Math.round(p.price * (1 - p.discountPercentage / 100)) : p.price}
                      </span>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.isArray(p.category) && p.category.map(cat => (
                        <span key={cat} className="bg-purple-200 text-purple-800 text-[10px] px-1 py-0.5 rounded">{cat}</span>
                      ))}
                    </div>

                    {/* Product Types */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.isArray(p.productType) && p.productType.map(type => (
                        <span key={type} className="bg-green-200 text-green-800 text-[10px] px-1 py-0.5 rounded">{type}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Images Modal */}
        {showImagesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-3 w-80">
              <h4 className="font-semibold mb-2 text-sm">Product Images</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {modalImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img.url} alt={`modal-${idx}`} className={`w-16 h-16 object-cover border ${modalThumbnailIndex === idx ? "border-blue-500" : "border-gray-300"}`} style={{ cursor: "pointer" }} onClick={() => handleSetThumbnailFromModal(idx)} />
                    {modalThumbnailIndex === idx && <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">Thumbnail</span>}
                    <button type="button" className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1" onClick={() => handleDeleteImageFromModal(idx)}>✕</button>
                  </div>
                ))}
              </div>
              <button type="button" className="w-full py-1 bg-gray-600 text-white text-xs rounded" onClick={() => setShowImagesModal(false)}>Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
