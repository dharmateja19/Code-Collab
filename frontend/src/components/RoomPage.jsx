import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [code, setCode] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLeave = () => {
    navigate("/dashboard");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied!");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            Room ID: <span className="text-blue-400">{roomId}</span>
          </h2>

          <button
            onClick={handleCopy}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-sm transition"
          >
            Copy
          </button>
        </div>

        <button
          onClick={handleLeave}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
        >
          Leave Room
        </button>

      </div>

      {/* Editor */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-4 h-[75vh]">

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Start typing your code here..."
          className="w-full h-full bg-gray-800 text-green-400 font-mono text-sm resize-none outline-none"
        />

      </div>

    </div>
  );
};

export default RoomPage;