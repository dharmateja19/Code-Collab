import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const RoomEditor = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const socketRef = useRef(null);
  const saveTimeout = useRef(null);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const [showChat, setShowChat] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      // console.log("Connected:", socket.id);
      socket.emit("join-room", roomId);
      toast.success("Joined room successfully!", { id: "join-room" });
    });

    socket.on("load-code", setCode);
    socket.on("receive-code", setCode);
    socket.on("load-language", setLanguage);
    socket.on("receive-language", setLanguage);
    socket.on("active-users", setParticipants);

    socket.on("load-messages", (loadedMessages) => {
      console.log("Loaded messages:", loadedMessages.length);
      setMessages(loadedMessages);
    });

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leave-room", roomId);
      socket.disconnect();
    };
  }, [roomId, token]);

  const handleCopyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    toast.success("Room ID copied");
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);

    socketRef.current.emit("language-change", {
      roomId,
      language: selectedLang,
    });
  };

  // Handle editor change
  const handleEditorChange = (value) => {
    setCode(value);

    // Emit to other users
    socketRef.current.emit("code-change", {
      roomId,
      code: value,
    });

    // Auto-save to DB (debounced)
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      try {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/room/${roomId}/code`,
          { code: value },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {
        console.log(error);
        console.log("Save failed");
      }
    }, 1000);
  };

  const handleLeave = () => {
    toast.success("You left the room");
    navigate("/dashboard");
  };

  const handleSend = () => {
    if (!input.trim()) return;

    socketRef.current.emit("send-message", {
      roomId,
      message: input,
    });

    setInput("");
  };

  const decoded = token ? jwtDecode(token) : null;
  const currentUserId = decoded?.id;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white overflow-hidden">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-700 bg-[#202020]">
        {/* Left: Room ID */}
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Room:</h3>
          <span className="text-indigo-400 font-mono text-sm bg-indigo-500/10 px-3 py-1 rounded-md border border-indigo-500/30">
            {roomId}
          </span>
          <button
            onClick={handleCopyRoomId}
            className="bg-[#2d2d2d] hover:bg-[#333] border border-gray-600 px-2 py-1 rounded-md text-xs transition cursor-pointer"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Center: Language Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Language</span>

          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-[#2d2d2d] border border-gray-600 px-3 py-1 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Right: Leave Button */}
        <button
          onClick={handleLeave}
          className="bg-red-600 hover:bg-red-700 hover:scale-105 transition px-4 py-1 rounded-md text-sm shadow-md cursor-pointer"
        >
          Leave
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div className="w-64 bg-[#252526] border-r border-gray-700 p-4 flex flex-col">
          <h4 className="text-md font-semibold mb-4 text-gray-300">
            Participants ({participants.length})
          </h4>

          <ul className="space-y-2 overflow-y-auto">
            {participants.map((user) => (
              <li
                key={user.userId}
                className="bg-[#2d2d2d] px-3 py-2 rounded-md hover:bg-[#333] transition flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <span>{user.name}</span>

                  {user.role === "owner" && (
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
                      Owner
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Monaco Editor */}
        <div className={`flex-1 transition-all duration-300`}>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </div>

        {/* Chat Panel */}
        <div
          className={`
            absolute right-0 top-0 h-full w-80
            bg-[#252526] border-l border-gray-700
            flex flex-col
            transform transition-transform duration-300 ease-in-out
            ${showChat ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Header */}
          <div className="p-3 font-semibold border-b border-gray-700 flex justify-between items-center">
            <span>Room Chat</span>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-white text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, index) => {
              const isOwnMessage = msg.userId?.toString() === currentUserId;

              if (msg.type === "system") {
                return (
                  <div
                    key={index}
                    className="text-center text-gray-400 text-sm italic"
                  >
                    {msg.message}
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    isOwnMessage ? "items-end" : "items-start"
                  }`}
                >
                  <div className="text-xs text-gray-400">{msg.username}</div>

                  <div
                    className={`px-3 py-2 rounded-lg max-w-xs wrap-break-word ${
                      isOwnMessage
                        ? "bg-blue-600 text-white"
                        : "bg-[#3c3c3c] text-white"
                    }`}
                  >
                    {msg.message}
                  </div>

                  <div className="text-[10px] text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              );
            })}

            <div ref={chatEndRef}></div>
          </div>

          {/* Input */}
          <div className="p-2 border-t border-gray-700 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-[#1e1e1e] text-white p-2 rounded outline-none"
            />

            <button
              onClick={handleSend}
              className="bg-blue-600 px-4 rounded text-white cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="
            fixed bottom-6 right-6
            w-14 h-14
            rounded-full
            bg-indigo-600 hover:bg-indigo-700
            shadow-lg
            flex items-center justify-center
            text-white text-xl  
            transition transform hover:scale-110 cursor-pointer
          "
        >
          💬
        </button>
      )}
    </div>
  );
};

export default RoomEditor;
