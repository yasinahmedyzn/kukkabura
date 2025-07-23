import React, { useState } from "react";
import { links } from "./data";
import logo from "../Images/logo.svg";
import { useCart } from "react-use-cart";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { totalUniqueItems } = useCart();

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[7vh] relative">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/">
            <img
              src={logo}
              alt="main logo"
              className="h-auto w-32 sm:w-40 object-contain"
            />
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {links.map(({ id, url, text }) => (
              <li key={id}>
                <a
                  href={url}
                  className="text-gray-800 hover:text-blue-600 transition"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/cart" className="relative">
            <i className="fas fa-cart-plus text-xl"></i>
            {totalUniqueItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalUniqueItems}
              </span>
            )}
          </a>
          <a href="/login">
            <i className="fa-solid fa-user text-xl"></i>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setShow((s) => !s)}
        >
          {show ? (
            <i className="fa fa-times"></i>
          ) : (
            <i className="fa fa-bars"></i>
          )}
        </button>

        {/* Mobile Nav */}
        {show && (
          <nav className="absolute top-full left-0 w-full bg-white shadow-md md:hidden z-10">
            <ul className="flex flex-col p-4 space-y-4">
              {links.map(({ id, url, text }) => (
                <li key={id}>
                  <a
                    href={url}
                    className="block text-gray-800 hover:text-blue-600 transition"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
            <div className="border-t mt-2 pt-2 flex items-center justify-around">
              <a href="/cart" className="relative">
                <i className="fas fa-cart-plus text-xl"></i>
                {totalUniqueItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalUniqueItems}
                  </span>
                )}
              </a>
              <a href="/login">
                <i className="fa-solid fa-user text-xl"></i>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
