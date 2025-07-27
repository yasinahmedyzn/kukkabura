import { Link } from "react-router-dom";
const products = [
  {
    id: 1,
    name: "Travel Adapter",
    href: "#",
    imageSrc:
      "https://images.squarespace-cdn.com/content/v1/5936d5865016e1ef18350db7/9ec24d3c-7e9b-4abc-af01-c6e1b616f4dd/coffee-cup-japan-2023-9.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  {
    id: 2,
    name: "Travelrest The Ultimate Travel Pillow",
    href: "#",
    imageSrc:
      "https://m.media-amazon.com/images/I/811s2pez50L.jpg",
    imageAlt: "Front of men's Basic Tee in white.",
    price: "$35",
    color: "Aspen White",
  },
  {
    id: 3,
    name: "Packing cubes",
    href: "#",
    imageSrc:
      "https://www.travelsentry.org/wp-content/uploads/2022/12/TS_PackingCubes_Feature-345x320.jpg",
    imageAlt: "Front of men's Basic Tee in dark gray.",
    price: "$35",
    color: "Charcoal",
  },
  {
    id: 4,
    name: "Reusable toiletry bottles",
    href: "#",
    imageSrc:
      "https://shakirscollection.com/wp-content/uploads/2024/05/threeb1-600x600.jpg",
    imageAlt:
      "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
    price: "$35",
    color: "Iso Dots",
  },
];

export default function TravelPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Popular Item
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {product.price}
                </p>
            
              </div>
            </div>
          ))}
        </div>
         <Link to="/" className="text-blue-600 underline">← Back to Categories</Link>
      </div>
    </div>
  );
}
