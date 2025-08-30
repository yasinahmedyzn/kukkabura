import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../src/context/AuthContext";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const { login } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [animate, setAnimate] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => setAnimate(true), []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials. Try again.");
        return;
      }

      login(data.user, data.token);
      setSuccessMessage("Welcome back!");
      setTimeout(() => {
        setSuccessMessage("");
        onLoginSuccess();
      }, 1200);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccessMessage("Registration successful!");
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      setTimeout(() => {
        setSuccessMessage("");
        setIsRegister(false);
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center px-4 sm:px-0">
      {/* Blurred Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 transform transition-all duration-300 ${
          animate ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        {/* Success Message */}
        {successMessage && (
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex justify-center items-center shadow-md animate-ping-once">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="mt-3 text-lg font-semibold text-green-600">
              {successMessage}
            </p>
          </div>
        )}

        {!successMessage && (
          <>
            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-pink-600">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-500 text-sm text-center mb-4">
              {isRegister
                ? "Sign up to join the beauty community ✨"
                : "Login to continue shopping"}
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
            )}

            {/* Form */}
            <form
              onSubmit={isRegister ? handleRegister : handleLogin}
              className="space-y-4"
            >
              {isRegister && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
                    required
                  />
                </div>
              )}

              <input
                type="email"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
                required
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl shadow-lg hover:shadow-pink-500/50 transition duration-300 font-semibold"
              >
                {isRegister ? "Register" : "Login"}
              </button>
            </form>

            {/* Switch Between Modes */}
            <p className="text-center text-sm text-gray-500 mt-3">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="text-pink-600 font-semibold cursor-pointer hover:text-purple-600"
              >
                {isRegister ? "Login" : "Register"}
              </span>
            </p>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="mt-3 w-full border border-gray-300 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes ping-once {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-ping-once {
          animation: ping-once 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
