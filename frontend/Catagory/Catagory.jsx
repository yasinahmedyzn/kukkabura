import { Link } from "react-router-dom";

const callouts = [
  {
    name: "Skin Care",
    description: "Cleansers, creams & treatments for radiant skin",
    imageSrc:
      "https://www.bellobello.my/wp-content/uploads/2022/08/boldlipessentials-2.jpg",
    imageAlt:
      "Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.",
    href: "/product/skincare-products",
  },
  {
    name: "Hair Care",
    description: "Shampoos, conditioners & styling essentials",
    imageSrc:
      "https://www.hkvitals.com/blog/wp-content/uploads/2023/08/900-29.jpg",
    imageAlt:
      "Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.",
    href: "/product/hair-products",
  },
  {
    name: "Tools & Brushes",
    description: "Professional tools for flawless application",
    imageSrc:
      "https://cdn.thewirecutter.com/wp-content/media/2024/10/makeupbrushes-2048px-01010-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp",
    imageAlt:
      "Collection of four insulated travel bottles on wooden shelf.",
    href: "/product/tools-brushes-products",
  },
  {
    name: "Bath & Body",
    description: "Luxurious care for everyday indulgence",
    imageSrc:
      "https://media.istockphoto.com/id/1546442230/photo/front-view-skin-care-products-on-wooden-decorative-piece.jpg?s=612x612&w=0&k=20&c=4qEsfqeNNAcrlzZOwMjs9mZzPBUf1ey22v0gSjt7NcY=",
    imageAlt:
      "Collection of four insulated travel bottles on wooden shelf.",
    href: "/product/bath&body-products",
  },
];

export default function Catagory() {
  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-4 sm:py-12 lg:max-w-none lg:py-16">
          <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-3">
            Collections
          </h2>

          {/* ---------------- MOBILE VERSION ---------------- */}
          <div className="grid grid-cols-2 gap-4 sm:hidden">
            {callouts.map((callout) => (
              <div key={callout.name} className="group relative">
                <img
                  alt={callout.imageAlt}
                  src={callout.imageSrc}
                  className="w-full h-24 rounded-lg bg-white object-cover group-hover:opacity-75 transition duration-200"
                />
                <h3 className="mt-1 text-[11px] text-gray-500 text-center truncate">
                  <Link to={callout.href}>
                    <span className="absolute inset-0" />
                    {callout.name}
                  </Link>
                </h3>
              </div>
            ))}
          </div>

          {/* ---------------- DESKTOP VERSION ---------------- */}
          <div className="hidden sm:grid grid-cols-3 gap-6">
            {callouts.slice(0, 3).map((callout) => (
              <div key={callout.name} className="group relative">
                <img
                  alt={callout.imageAlt}
                  src={callout.imageSrc}
                  className="w-full h-48 rounded-lg bg-white object-cover group-hover:opacity-75 transition duration-200"
                />
                <h3 className="mt-1 text-sm text-gray-500 text-center truncate">
                  <Link to={callout.href}>
                    <span className="absolute inset-0" />
                    {callout.name}
                  </Link>
                </h3>
                <p className="text-sm italic text-gray-900 text-center">
                  {callout.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
