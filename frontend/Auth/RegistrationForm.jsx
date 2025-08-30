import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Registration() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        form
      );
      alert(res.data.message);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-center text-3xl font-extrabold text-pink-600">
          Create Your MeiGlow Account
        </h2>
        <p className="text-center text-gray-500 mt-2 mb-6 text-sm">
          Join the beauty community ✨
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Fields */}
          <div className="flex gap-3">
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-1/2 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-1/2 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl shadow-lg hover:shadow-pink-500/50 transition duration-300 font-semibold"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-pink-600 hover:text-purple-600"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
