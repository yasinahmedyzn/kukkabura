import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../src/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );

      const userData = res.data.user;
      const jwtToken = res.data.token;

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(userData));

      login(userData, jwtToken);
      setMessage(res.data.message || "Login successful");

      setTimeout(() => {
        navigate(userData.role === "admin" ? "/admin-dashboard" : "/");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed: Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* Login Card */}
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-center text-3xl font-extrabold text-pink-600">
          Sign in to MeiGlow
        </h2>
        <p className="text-center text-gray-500 mt-2 mb-6 text-sm">
          Beauty starts with your account ✨
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl shadow-lg hover:shadow-pink-500/50 transition duration-300 font-semibold"
          >
            Sign In
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-pink-700 font-medium">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Not a member?{" "}
          <Link
            to="/registration"
            className="font-semibold text-pink-600 hover:text-purple-600"
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
