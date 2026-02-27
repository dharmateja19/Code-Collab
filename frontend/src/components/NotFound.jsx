import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] text-white">
      <h1 className="text-6xl font-bold text-indigo-500 mb-4">404</h1>
      <p className="text-gray-400 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <Link
        to="/dashboard"
        className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-md transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;