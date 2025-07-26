import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaHeart,
  FaGift,
  FaShoppingCart,
  FaBars,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../Images/logo.svg";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-transparent shadow-sm">
        <div className="w-full max-w-[1320px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Categories */}
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  src={logo}
                  alt="main logo"
                  className="h-24 sm:h-24 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Categories Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-haspopup="true"
                aria-expanded={showDropdown}
                className="flex items-center gap-1 text-sm font-bold text-black px-3 py-1 rounded-lg bg-white hover:shadow-md transition-all"
              >
                <FaBars />
                Categories
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div
                  className="absolute top-16 left-0 z-50 w-64 max-h-[400px] overflow-y-auto rounded-md bg-white shadow-xl border border-gray-200 transition-all"
                >
                  <ul className="text-sm text-gray-800 font-medium">
                    {[
                      "Accessories",
                      "Art & Collectibles",
                      "Baby",
                      "Bags & Purses",
                      "Bath & Beauty",
                      "Books, Movies & Music",
                      "Clothing",
                      "Craft Supplies & Tools",
                      "Electronics & Accessories",
                      "Gifts",
                      "Home & Living",
                      "Jewelry",
                    ].map((item) => (
                      <li
                        key={item}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-6">
            <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search for anything"
                className="w-full px-4 py-2 focus:outline-none"
              />
              <button
                className="px-4 py-2 text-gray-700 transition duration-300 hover:text-orange-600"
                type="button"
                style={{
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter =
                    "drop-shadow(0 0 6px rgba(255,115,0,0.8))";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "none";
                }}
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6 text-gray-700 text-sm">
            <button className="hover:underline" type="button">
              Sign in
            </button>
            <FaHeart className="cursor-pointer" />
            <FaGift className="cursor-pointer" />
            <FaShoppingCart className="cursor-pointer" />
          </div>
        </div>
      </nav>

      {/* Bottom Category Links */}
      <div className="py-3 shadow-sm bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center gap-8 text-sm font-medium text-gray-700">
            {[
              { label: "Home", path: "/" },
              { label: "About", path: "/about" },
              { label: "Product", path: "/product" },
              { label: "Service", path: "/service" },
            ].map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className="cursor-pointer rounded-md px-2 py-1 transition-colors duration-300 ease-in-out hover:text-orange-600 hover:underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
