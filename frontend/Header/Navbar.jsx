import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../src/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaHeart,
  FaGift,
  FaShoppingCart,
  FaBars,
  FaUserCircle,
} from "react-icons/fa";
import logo from "../Images/logo.svg";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Use user and logout from AuthContext (no local user state here!)
  const { user, logout } = useContext(AuthContext);

  // Hide dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();      // Call logout from context, which clears storage and context state
    navigate("/login");
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-transparent shadow-sm">
        <div className="w-full max-w-[1320px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Categories */}
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <Link to="/">
              <img
                src={logo}
                alt="main logo"
                className="h-24 sm:h-24 w-auto object-contain"
              />
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 text-sm font-bold text-black px-3 py-1 rounded-lg bg-white hover:shadow-md transition-all"
              >
                <FaBars />
                Categories
              </button>

              {showDropdown && (
                <div className="absolute top-16 left-0 z-50 w-64 max-h-[400px] overflow-y-auto rounded-md bg-white shadow-xl border border-gray-200">
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
                className="px-4 py-2 text-gray-700 hover:text-orange-600"
                type="button"
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Icons and Auth Links */}
          <div className="flex items-center gap-6 text-gray-700 text-sm relative">
            {!user ? (
              <Link to="/login">
                <button className="hover:underline" type="button">
                  Sign in
                </button>
              </Link>
            ) : (
              <div ref={profileRef} className="relative">
                <button
                  className="flex items-center gap-2 text-sm font-medium"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <FaUserCircle className="text-lg" />
                  {user.firstName || "Profile"}
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <FaHeart className="cursor-pointer" />
            <FaGift className="cursor-pointer" />
            <FaShoppingCart className="cursor-pointer" />
          </div>
        </div>
      </nav>

      {/* Bottom Nav Links */}
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
                className="cursor-pointer rounded-md px-2 py-1 hover:text-orange-600 hover:underline"
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
