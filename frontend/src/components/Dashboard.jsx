import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("${import.meta.env.VITE_BACKEND_URL}/room/my-rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRooms(response.data.rooms);
    } catch (error) {
      // console.log(error);
      toast.error(error.response?.data?.message || "Unable to fetch rooms");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchRooms();
    }
  }, [token, navigate]);

  const handleJoin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/room/join`,
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log(response.data)
      navigate(`/room/${roomId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to join room");
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/room/create`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newRoomId = response.data.room.roomId;
      navigate(`/room/${newRoomId}`);
      toast.success("Room created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create room");
    }
  };

  const handleDelete = async (roomId) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/room/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success("Room deleted successfully!");
    fetchRooms(); 
  } catch (error) {
    console.log(error)
    toast.error(error.response?.data?.message || "Unable to delete room");
  }
};

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Welcome */}
        <h1 className="text-3xl font-bold mb-8">
          Welcome back, <span className="text-indigo-400">{user?.name}</span>
        </h1>

        {/* Actions Card */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Create Room */}
            <button
              onClick={handleCreate}
              className="bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition text-white px-6 py-3 rounded-lg shadow-lg cursor-pointer"
            >
              Create Room
            </button>

            {/* Join Room */}
            <div className="flex flex-1 gap-3">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="flex-1 bg-white/10 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />

              <button
                onClick={handleJoin}
                className="bg-green-600 hover:bg-green-700 hover:scale-105 transition text-white px-6 py-3 rounded-lg shadow-lg cursor-pointer"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Your Rooms</h2>

          {rooms.length === 0 ? (
            <p className="text-gray-400">No rooms yet. Create or join one.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white/5 border border-gray-700 rounded-lg p-4 flex justify-between items-center hover:border-indigo-500 transition"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/room/${room.roomId}`)}
                  >
                    <p className="font-semibold text-indigo-400">
                      {room.roomId}
                    </p>
                    <p className="text-sm text-gray-400">
                      Created: {new Date(room.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {room.owner?.toString() === user.id &&  (
                    <button
                      onClick={() => handleDelete(room.roomId)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
