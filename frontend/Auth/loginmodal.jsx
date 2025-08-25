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
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => setAnimate(true), []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // LOGIN
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

      if (res.status === 404 || !res.ok) {
        setError("No account found with this email. Please try again.");
        return;
      }

      login(data.user, data.token);
      setSuccessMessage("Success!");
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        setSuccessMessage("");
        onLoginSuccess();
      }, 1000); // Shortened duration
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccessMessage("Registered!");
      setForm({ firstName: "", lastName: "", email: "", password: "" });

      setTimeout(() => {
        setSuccessMessage("");
        setIsRegister(false);
      }, 1000); // Shortened duration
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center px-4 sm:px-0">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div
        className={`relative w-full max-w-md p-6 sm:p-8 bg-white rounded-3xl shadow-2xl transform transition-all duration-300 ${
          animate ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        {/* Success Message */}
        {successMessage && (
          <div className="flex justify-center items-center mb-6">
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
          </div>
        )}

        {!successMessage && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-500 text-sm text-center mb-4">
              {isRegister ? "Sign up to start shopping" : "Login to continue shopping"}
            </p>

            {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

            <form
              onSubmit={isRegister ? handleRegister : handleLogin}
              className="space-y-3 sm:space-y-4"
            >
              {isRegister && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
              />

              <button
                type="submit"
                className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
              >
                {isRegister ? "Register" : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-3">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="text-red-500 font-semibold cursor-pointer hover:underline"
              >
                {isRegister ? "Login" : "Register"}
              </span>
            </p>

            <button
              onClick={onClose}
              className="mt-3 w-full border border-gray-300 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes ping-once {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-ping-once {
          animation: ping-once 0.8s ease-out forwards;
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
        }
        .animate-[confetti_1s_ease-in-out] {
          animation: confetti 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
