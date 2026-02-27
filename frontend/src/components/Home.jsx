import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col justify-center items-center px-6">

      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
          Real-Time Collaborative Coding
        </h1>

        <p className="text-gray-300 text-lg mb-10">
          Create rooms, invite developers, and code together seamlessly using
          Monaco Editor and live synchronization powered by Socket.io.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            to="/register"
            className="px-8 py-3 bg-indigo-600 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
          >
            Get Started
          </Link>

          <Link
            to="/dashboard"
            className="px-8 py-3 border border-gray-500 rounded-xl text-lg hover:bg-gray-800 transition"
          >
            Join Room
          </Link>
        </div>
      </div>

      {/* Optional Feature Highlights */}
      <div className="mt-20 grid md:grid-cols-3 gap-8 text-center max-w-5xl">
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Live Code Sync</h3>
          <p className="text-gray-400">
            Instant updates across all participants in the room.
          </p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Room Management</h3>
          <p className="text-gray-400">
            Create, join, and leave rooms securely with authentication.
          </p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">VS Code Editor</h3>
          <p className="text-gray-400">
            Monaco Editor integration for a professional coding experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;