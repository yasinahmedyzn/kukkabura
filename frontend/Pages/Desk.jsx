import { Link } from 'react-router-dom';
import Catagory from "../Catagory/Catagory";
const products = [
  {
    id: 1,
    name: "Ergonomic chair",
    href: "#",
    imageSrc:
      "https://cdn.autonomous.ai/static/upload/images/common/upload/20210319/2._Ergonomic_Office_Chair42f897ed02.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  {
    id: 2,
    name: "Laptop Stand",
    href: "#",
    imageSrc:
      "https://imageio.forbes.com/specials-images/imageserve/6685569cfa05201a63506189/Home-office/960x0.jpg?height=473&width=711&fit=bounds",
    imageAlt: "Front of men's Basic Tee in white.",
    price: "$35",
    color: "Aspen White",
  },
  {
    id: 3,
    name: "Blue light blocking glasses",
    href: "#",
    imageSrc:
      "http://t2.gstatic.com/images?q=tbn:ANd9GcQc2GIeHAqGSuPM5OFJSrSy0a1Sf1SV_QEtGIwi6ltplC59jO8B",
    imageAlt: "Front of men's Basic Tee in dark gray.",
    price: "$35",
    color: "Charcoal",
  },
  {
    id: 4,
    name: "Desk",
    href: "#",
    imageSrc:
      "https://www.aertsen.in/wp-content/uploads/2023/07/Desk-Mat-825x1024.jpg",
    imageAlt:
      "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
    price: "$35",
    color: "Iso Dots",
  },
    {
    id: 5,
    name: "Desk Lamp",
    href: "#",
    imageSrc:
      "https://www.aertsen.in/wp-content/uploads/2023/07/Desk-Lamp.jpg",
    imageAlt:
      "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
    price: "$35",
    color: "Iso Dots",
  },
    {
    id: 6,
    name: "Indoor Plants",
    href: "#",
    imageSrc:
      "https://fsc-ccf.ca/wp-content/uploads/2023/03/mikey-harris-qVnyj4NYLZs-unsplash-1024x683.jpeg",
    imageAlt:
      "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
    price: "$35",
    color: "Iso Dots",
  },
    {
    id: 7,
    name: "A cushy footrest",
    href: "#",
    imageSrc:
      "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1635362040-41kmot7QshL._SL500_.jpg?crop=1xw:1.00xh;center,top&resize=980:*",
    imageAlt:
      "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
    price: "$35",
    color: "Iso Dots",
  },
  
];


export default function DeskPage() {
   
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Work from Home Accessories
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
