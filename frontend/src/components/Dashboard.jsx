import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    // TODO: Fetch joined rooms from backend
    // fetchRooms();
  }, [token, navigate]);

  const handleJoin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/room/join",
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/room/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newRoomId = response.data.roomId;
      navigate(`/room/${newRoomId}`);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-10">

      <div className="max-w-4xl mx-auto">

        {/* Welcome */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome back, {user?.name} 
        </h1>

        {/* Action Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">

          <div className="flex flex-col md:flex-row gap-4">

            <button
              onClick={handleCreate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition"
            >
              Create Room
            </button>

            <div className="flex flex-1 gap-3">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                onClick={handleJoin}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition"
              >
                Join
              </button>
            </div>

          </div>
        </div>

        {/* Rooms Section (Future Dynamic) */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Rooms</h2>

          {rooms.length === 0 ? (
            <p className="text-gray-500">No rooms yet. Create or join one.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/room/${room.roomId}`)}
                >
                  <p className="font-semibold">{room.roomId}</p>
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