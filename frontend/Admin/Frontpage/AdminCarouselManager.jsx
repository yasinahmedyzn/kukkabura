import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function AdminCarouselDashboard() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/carousel-images/all`
      );
      setImages(res.data);
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/carousel-images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage("✅ Upload successful!");
      setFile(null);
      fileInputRef.current.value = null;
      await fetchImages();
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    setDeletingId(id);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/carousel-images/${id}`
      );
      setImages(images.filter((img) => img._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete image.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow p-3 rounded-lg mt-0">
        <h1 className="text-lg font-semibold text-center mb-4">
          🖼️ Carousel Manager
        </h1>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="mb-4 text-center">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <label className="bg-blue-600 text-white px-3 py-1 text-sm rounded cursor-pointer hover:bg-blue-700 transition">
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                ref={fileInputRef}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={uploading}
              className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 disabled:opacity-50 transition"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* Selected file */}
          {file && (
            <p className="mt-2 text-xs text-gray-600">
              File: <span className="font-medium">{file.name}</span>
            </p>
          )}
          {message && <p className="mt-1 text-xs text-gray-700">{message}</p>}
        </form>

        {/* Images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {images.map(({ _id, url }) => (
            <div
              key={_id}
              className="relative border rounded overflow-hidden shadow-sm"
            >
              <img
                src={url}
                alt="Carousel"
                className="w-full h-28 object-cover"
              />
              <button
                onClick={() => handleDelete(_id)}
                disabled={deletingId === _id}
                className="absolute top-1 right-1 bg-red-600 text-white px-2 py-0.5 text-xs rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId === _id ? "..." : "✖"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
