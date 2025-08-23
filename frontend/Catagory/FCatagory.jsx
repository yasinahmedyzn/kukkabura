import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBrush, FaSmile, FaEye, FaBaby, FaGift, FaTshirt, FaHatCowboy, FaShoePrints } from "react-icons/fa";
import { GiComb, GiLipstick, GiHairStrands, GiWatch, GiNecklaceDisplay, GiSunglasses } from "react-icons/gi";
import { MdMasks } from "react-icons/md";
import { TbToolsKitchen2 } from "react-icons/tb";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "Giftbox", icon: <FaGift className="text-pink-500 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Tools & Brushes", icon: <TbToolsKitchen2 className="text-yellow-500 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Accessories", icon: <GiComb className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Makeup", icon: <FaBrush className="text-pink-500 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Face", icon: <FaSmile className="text-gray-600 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Eyes", icon: <FaEye className="text-black w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Lip", icon: <GiLipstick className="text-red-500 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Hair", icon: <GiHairStrands className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Face Mask", icon: <MdMasks className="text-green-500 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Baby Care", icon: <FaBaby className="text-pink-400 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Clothing", icon: <FaTshirt className="text-indigo-500 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Shoes", icon: <FaShoePrints className="text-brown-500 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Hats", icon: <FaHatCowboy className="text-amber-600 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Watches", icon: <GiWatch className="text-gray-800 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Jewelry", icon: <GiNecklaceDisplay className="text-yellow-600 w-6 h-6 sm:w-8 sm:h-8" /> },
  { name: "Sunglasses", icon: <GiSunglasses className="text-black w-6 h-6 sm:w-8 sm:h-8" /> },
];

// helper to convert name to URL-friendly slug
const toSlug = (name) => name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");

export default function FeaturedCategories() {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const [showAll, setShowAll] = useState(false);

  const initialCategories = isMobile ? categories.slice(0, 9) : categories;
  const extraCategories = isMobile ? categories.slice(9) : [];

  return (
    <div className="bg-white py-6">
      <div className="container mx-auto max-w-screen-xl px-4">
        <h2 className="text-center text-base sm:text-xl font-bold text-gray-800 mb-1">
          Featured Categories
        </h2>
        <p className="text-center text-green-600 text-xs sm:text-sm mb-6">
          Shop Your Desired Product from Featured Category
        </p>

        {/* Grid layout */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {initialCategories.map((cat, index) => (
            <Link
              key={index}
              to={`/product/${toSlug(cat.name)}-products`}
              className="flex flex-col items-center justify-center p-2 sm:p-4 border border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="mb-1 sm:mb-2 transform transition duration-300 hover:scale-125">
                {cat.icon}
              </div>
              <p className="text-[9px] sm:text-xs text-center text-gray-800 font-medium">
                {cat.name}
              </p>
            </Link>
          ))}

          {/* AnimatePresence for extra categories */}
          <AnimatePresence>
            {showAll &&
              extraCategories.map((cat, index) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: -20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, rotateX: -90 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <Link
                    to={`/product/${toSlug(cat.name)}-products`}
                    className="flex flex-col items-center justify-center p-2 sm:p-4 border border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md"
                  >
                    <div className="mb-1 sm:mb-2 transform transition duration-300 hover:scale-125">
                      {cat.icon}
                    </div>
                    <p className="text-[9px] sm:text-xs text-center text-gray-800 font-medium">
                      {cat.name}
                    </p>
                  </Link>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Mobile: View More / Show Less */}
        {isMobile && (
          <div className="mt-5 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {showAll ? "Show Less" : "View More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
