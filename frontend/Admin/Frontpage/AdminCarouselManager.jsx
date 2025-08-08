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
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/carousel-images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
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
      <div className="w-full max-w-4xl bg-white shadow-lg p-4 rounded-lg mt-0">
        <h1 className="text-2xl font-bold text-center mb-6">
          🖼️ Admin Carousel Dashboard
        </h1>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="mb-6 text-center">
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <label className="bg-blue-600 text-white px-5 py-2 rounded cursor-pointer hover:bg-blue-700 transition">
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
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* Show selected file name */}
          {file && (
            <p className="mt-3 text-sm text-gray-600">
              Selected File: <span className="font-medium">{file.name}</span>
            </p>
          )}

          {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </form>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map(({ _id, url }) => (
            <div
              key={_id}
              className="relative border rounded overflow-hidden shadow-sm"
            >
              <img
                src={url}
                alt="Carousel"
                className="w-full h-40 object-cover"
              />
              <button
                onClick={() => handleDelete(_id)}
                disabled={deletingId === _id}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId === _id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
