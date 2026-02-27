import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Login successful!");
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black px-4">

      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome Back 👋
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 hover:scale-105 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-lg cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          New user?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;