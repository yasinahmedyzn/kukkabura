import { Link } from "react-router-dom";

const callouts = [
  {
    name: "Desk and Office",
    description: "Work from home accessories",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-edition-01.jpg",
    imageAlt:
      "Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.",
    href: "/Desk",
  },
  {
    name: "Self-Improvement",
    description: "Journals and note-taking",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-edition-02.jpg",
    imageAlt:
      "Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.",
    href: "/Self",
  },
  {
    name: "Travel",
    description: "Daily commute essentials",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-edition-03.jpg",
    imageAlt:
      "Collection of four insulated travel bottles on wooden shelf.",
    href: "/Travel",
  },
];

export default function Catagory() {
  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-4 sm:py-12 lg:max-w-none lg:py-16">
          {/* Smaller text for mobile */}
          <h2 className="text-base text-base sm:text-xl font-bold text-gray-800 mb-6">
            Collections
          </h2>

          {/* Compact grid for mobile */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {callouts.map((callout) => (
              <div key={callout.name} className="group relative">
                <img
                  alt={callout.imageAlt}
                  src={callout.imageSrc}
                  className="w-full h-14 sm:h-48 rounded-lg bg-white object-cover group-hover:opacity-75 transition duration-200"
                />
                <h3 className="mt-1 text-[9px] sm:text-sm text-gray-500 text-center truncate">
                  <Link to={callout.href}>
                    <span className="absolute inset-0" />
                    {callout.name}
                  </Link>
                </h3>
                {/* Description hidden on mobile */}
                <p className="hidden sm:block text-base font-semibold text-gray-900 text-center">
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
