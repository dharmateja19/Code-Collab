import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // backend URL

const RoomEditor = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);

  const userName = localStorage.getItem("userName") || "Guest";

  const handleLeave = () => {
    socket.disconnect();
    navigate("/dashboard");
  };

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socket.emit("join-room", roomId);

    socket.on("active-users", (users) => {
      console.log("Active users:", users);
      setParticipants(users);
    });

    return () => {
      socket.emit("leave-room", roomId);
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold">
          Room: <span className="text-green-400">{roomId}</span>
        </h3>

        <button
          onClick={handleLeave}
          className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md text-sm transition"
        >
          Leave Room
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[#252526] border-r border-gray-700 p-4">
          <h4 className="text-md font-semibold mb-4 text-gray-300">
            Participants
          </h4>

          <ul className="space-y-2">
            {
              <ul className="space-y-2">
                {participants.map((user) => (
                  <li
                    key={user.userId}
                    className="bg-[#2d2d2d] px-3 py-2 rounded-md"
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            }
          </ul>
        </div>

        {/* Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue="// Start coding..."
            theme="vs-dark"
          />
        </div>
      </div>
    </div>
  );
};

export default RoomEditor;
