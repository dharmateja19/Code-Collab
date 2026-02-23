import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        {/* Avatar */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-md">
            {user?.name[0].toUpperCase()}
          </div>
        </div>

        {/* Greeting */}
        <h2 className="text-center text-2xl font-bold mt-4">
          Hi, {user?.name} 
        </h2>

        {/* User Details */}
        <div className="mt-6 space-y-4">

          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-medium text-gray-800">{user?.name}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium text-gray-800">{user?.email}</p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition">
            Edit Profile
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition"
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;