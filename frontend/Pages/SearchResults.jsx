import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery().get("query");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        const res = await axios.get(`/api/products/search?q=${query}`);
        setProducts(res.data);
      }
    };
    fetchSearchResults();
  }, [query]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Results for "{query}"</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {products.map((p) => (
          <Link
            to={`/product/${p._id}`}
            key={p._id}
            className="border p-2 rounded shadow hover:shadow-lg"
          >
            <img
              src={p.images[0]}
              alt={p.name}
              className="h-40 w-full object-cover"
            />
            <h3 className="font-medium mt-2">{p.name}</h3>
            <p>${p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
