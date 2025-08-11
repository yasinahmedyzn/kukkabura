import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../src/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../src/context/CartContext"
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
  const { cartItems } = useCart();
  const [showDropdown, setShowDropdown] = useState(false); // categories (desktop & mobile)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  // separate refs for desktop vs mobile to avoid clobbering
  const dropdownRefDesktop = useRef(null);
  const dropdownRefMobile = useRef(null);
  const profileRefDesktop = useRef(null);
  const profileRefMobile = useRef(null);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Categories (desktop)
      if (
        showDropdown &&
        dropdownRefDesktop.current &&
        !dropdownRefDesktop.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
      // Categories (mobile)
      if (
        showDropdown &&
        dropdownRefMobile.current &&
        !dropdownRefMobile.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }

      // Profile (desktop)
      if (
        showProfileDropdown &&
        profileRefDesktop.current &&
        !profileRefDesktop.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
      // Profile (mobile)
      if (
        showProfileDropdown &&
        profileRefMobile.current &&
        !profileRefMobile.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }

      // Search (mobile small bar)
      if (showSearchBar && searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchBar(false);
      }
    };

    // Use click so Link navigation happens before closing
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown, showProfileDropdown, showSearchBar]);

  useEffect(() => {
    // if user changes (login/logout) close profile dropdown
    setShowProfileDropdown(false);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-transparent shadow-sm">
        <div className="w-full md:max-w-[1320px] md:mx-auto md:px-4 py-3 flex items-center justify-between">
          {/* Logo & Categories */}
          <div className="flex items-center gap-4 relative">
            <Link to="/">
              <img
                src={logo}
                alt="main logo"
                className="h-24 sm:h-24 w-auto object-contain"
              />
            </Link>

            <div className="relative" ref={dropdownRefDesktop}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // prevent this toggle click from reaching document
                  setShowDropdown((s) => !s);
                }}
                className="flex items-center gap-1 text-sm font-bold text-black px-3 py-1 rounded-lg bg-white hover:shadow-md transition-all"
              >
                <FaBars />
                Categories
              </button>

              {showDropdown && (
                // prevent clicks inside the dropdown from bubbling to document
                <div
                  className="absolute top-16 left-0 z-50 w-64 max-h-[400px] overflow-y-auto rounded-md bg-white shadow-xl border border-gray-200"
                  onClick={(e) => e.stopPropagation()}
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
              // desktop profile wrapper (separate ref)
              <div ref={profileRefDesktop} className="relative">
                <button
                  className="flex items-center gap-2 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileDropdown((s) => !s);
                  }}
                  type="button"
                >
                  <FaUserCircle className="text-lg" />
                  {user.firstName || "Profile"}
                </button>

                {showProfileDropdown && (
                  // prevent clicks inside the dropdown from bubbling to document
                  <div
                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Profile
                    </Link>

                    {user.role === "admin" ? (
                      <Link
                        to="/admin-dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/my-orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        My Orders
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <FaHeart className="cursor-pointer" />
            <FaGift className="cursor-pointer" />

            {/*Add to cart code*/}
            <div>
              <nav className="flex items-center justify-between p-1 bg-white shadow">
                {/* Other Navbar Content */}

                <Link to="/cart" className="relative cursor-pointer">
                  <FaShoppingCart className="text-base" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[12px] font-bold px-1 rounded-full leading-none">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Nav Links */}
        <div className="py-3 shadow-sm bg-white">
          <div className="w-full md:max-w-7xl md:mx-auto md:px-4">
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
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-white shadow-sm p-2 relative">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="logo" className="h-10 w-auto" />
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-2 text-gray-700 text-lg">
            {/* Category */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown((prev) => !prev);
                setShowSearchBar(false);
                setShowProfileDropdown(false);
              }}
              className="p-1"
            >
              <FaBars size={16} />
            </button>

            {/* Search */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSearchBar((prev) => !prev);
                setShowDropdown(false);
                setShowProfileDropdown(false);
              }}
              className="p-1"
            >
              <FaSearch size={16} />
            </button>

            {/* Sign in / Profile */}
            {!user ? (
              <Link to="/login">
                <FaUserCircle size={16} />
              </Link>
            ) : (
              <div ref={profileRefMobile} className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileDropdown((prev) => !prev);
                    setShowDropdown(false);
                    setShowSearchBar(false);
                  }}
                  className="p-1"
                >
                  <FaUserCircle size={16} />
                </button>

                {showProfileDropdown && (
                  <div
                    className="absolute right-0 top-8 w-[150px] bg-white/80 border border-gray-300 rounded-md shadow-md text-sm z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to="/profile"
                      className="block px-3 py-1 hover:bg-gray-100"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Profile
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin-dashboard"
                        className="block px-3 py-1 hover:bg-gray-100"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            {user && <>  <div>
              <nav className="flex items-center justify-between p-1 bg-white shadow">
                {/* Other Navbar Content */}

                <Link to="/cart" className="relative cursor-pointer">
                  <FaShoppingCart className="text-base" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[12px] font-bold px-1 rounded-full leading-none">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              </nav>
            </div></>}
          </div>
        </div>

        {/* Short Transparent Search Bar */}
        {showSearchBar && (
          <div
            ref={searchRef}
            className="absolute right-2 top-12 bg-white/80 border border-gray-300 rounded-md flex items-center px-2 py-1 shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Search..."
              className="px-1 py-0.5 text-sm w-[120px] bg-transparent focus:outline-none"
            />
            <FaSearch size={14} />
          </div>
        )}

        {/* Transparent Dropdown (mobile categories) */}
        {showDropdown && (
          <div
            ref={dropdownRefMobile}
            className="absolute right-2 top-12 w-[180px] bg-white/80 border border-gray-200 rounded-md shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="text-sm">
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
                  className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mobile Bottom Links */}
        <div className="mt-3 flex justify-center gap-5 text-sm font-medium text-gray-700">
          {[
            { label: "Home", path: "/" },
            { label: "About", path: "/about" },
            { label: "Product", path: "/product" },
            { label: "Service", path: "/service" },
          ].map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              className="hover:text-orange-600 hover:underline"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
