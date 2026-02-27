import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="relative z-50 bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-md">

      {/* LEFT SIDE */}
      <Link
        to="/"
        className="text-2xl font-bold text-blue-400 hover:text-blue-500 transition"
      >
        Code-Collab
      </Link>

      {/* RIGHT SIDE */}
      {!token ? (
        <div className="flex gap-6 text-lg">
          <Link to="/login" className="hover:text-blue-400">Login</Link>
          <Link to="/register" className="hover:text-blue-400">Register</Link>
        </div>
      ) : (
        <div className="relative" ref={dropdownRef}>
          
          {/* Avatar Button */}
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-blue-600 transition"
          >
            {user?.name[0].toUpperCase()}
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">

              <div className="px-4 py-3 border-b text-sm text-gray-700">
                Hi, <span className="font-semibold">{user?.name}</span>
              </div>

              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100 transition"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
              >
                Logout
              </button>

            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;