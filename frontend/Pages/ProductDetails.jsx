// pages/ProductDetails.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/details/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Product Image */}
      <div className="flex flex-col items-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full max-w-sm rounded-xl shadow-md"
        />
        <div className="flex gap-2 mt-2">
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="thumb"
              className="w-16 h-16 object-cover rounded cursor-pointer border"
            />
          ))}
        </div>
      </div>

      {/* Product Info */}

      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xl font-semibold text-red-500">
            ৳{product.discountPrice}
          </span>
          <span className="line-through text-gray-400">৳{product.price}</span>
          <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded">
            In Stock
          </span>
        </div>

        <p className="mt-4 text-gray-600">{product.description}</p>

        <button className="mt-6 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg shadow-md">
          Add to Cart
        </button>

        {/* Extra Sections */}
        <div className="mt-8 space-y-4">
          <section>
            <h2 className="font-semibold text-lg">Features</h2>
            <ul className="list-disc pl-5 text-gray-600">
              {product.features?.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-semibold text-lg">Benefits</h2>
            <ul className="list-disc pl-5 text-gray-600">
              {product.benefits?.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
