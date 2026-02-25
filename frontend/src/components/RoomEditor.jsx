// import { useParams, useNavigate } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000"); // backend URL

// const RoomEditor = () => {
//   const { roomId } = useParams();
//   const navigate = useNavigate();

//   const [participants, setParticipants] = useState([]);

//   const userName = localStorage.getItem("userName") || "Guest";

//   const handleLeave = () => {
//     socket.disconnect();
//     navigate("/dashboard");
//   };

//   useEffect(() => {
//     const socket = io("http://localhost:3000", {
//       auth: {
//         token: localStorage.getItem("token"),
//       },
//     });

//     socket.emit("join-room", roomId);

//     socket.on("active-users", (users) => {
//       console.log("Active users:", users);
//       setParticipants(users);
//     });

//     return () => {
//       socket.emit("leave-room", roomId);
//       socket.disconnect();
//     };
//   }, [roomId]);

//   return (
//     <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
//       {/* Header */}
//       <div className="h-14 flex items-center justify-between px-6 border-b border-gray-700">
//         <h3 className="text-lg font-semibold">
//           Room: <span className="text-green-400">{roomId}</span>
//         </h3>

//         <button
//           onClick={handleLeave}
//           className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md text-sm transition"
//         >
//           Leave Room
//         </button>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <div className="w-64 bg-[#252526] border-r border-gray-700 p-4">
//           <h4 className="text-md font-semibold mb-4 text-gray-300">
//             Participants
//           </h4>

//           <ul className="space-y-2">
//             {
//               <ul className="space-y-2">
//                 {participants.map((user) => (
//                   <li
//                     key={user.userId}
//                     className="bg-[#2d2d2d] px-3 py-2 rounded-md"
//                   >
//                     {user.name}
//                   </li>
//                 ))}
//               </ul>
//             }
//           </ul>
//         </div>

//         {/* Editor */}
//         <div className="flex-1">
//           <Editor
//             height="100%"
//             defaultLanguage="javascript"
//             defaultValue="// Start coding..."
//             theme="vs-dark"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoomEditor;

// import { useParams, useNavigate } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";

// const RoomEditor = () => {
//   const { roomId } = useParams();
//   const navigate = useNavigate();

//   const [participants, setParticipants] = useState([]);
//   const [code, setCode] = useState("");
//   const socketRef = useRef(null);
//   const saveTimeout = useRef(null);

//   const token = localStorage.getItem("token");

//   // 🔹 Fetch room + saved code
//   useEffect(() => {
//     const fetchRoom = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/room/${roomId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setCode(response.data.code);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchRoom();
//   }, [roomId, token]);

//   // 🔹 Setup socket
//   useEffect(() => {
//     const socket = io("http://localhost:3000", {
//       auth: { token },
//     });

//     socketRef.current = socket;

//     socket.emit("join-room", roomId);

//     socket.on("active-users", (users) => {
//       setParticipants(users);
//     });

//     return () => {
//       socket.emit("leave-room", roomId);
//       socket.disconnect();
//     };
//   }, [roomId, token]);

//   // 🔹 Auto-save (debounced)
//   const handleEditorChange = (value) => {
//     setCode(value);

//     if (saveTimeout.current) {
//       clearTimeout(saveTimeout.current);
//     }

//     saveTimeout.current = setTimeout(async () => {
//       try {
//         await axios.put(
//           `http://localhost:3000/room/${roomId}/code`,
//           { code: value },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       } catch (error) {
//         console.log("Save failed");
//       }
//     }, 1000); // saves 1 sec after typing stops
//   };

//   return (
//     <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">

//       {/* Header */}
//       <div className="h-14 flex items-center justify-between px-6 border-b border-gray-700">
//         <h3 className="text-lg font-semibold">
//           Room: <span className="text-indigo-400">{roomId}</span>
//         </h3>

//         <button
//           onClick={() => navigate("/dashboard")}
//           className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-md text-sm"
//         >
//           Leave
//         </button>
//       </div>

//       <div className="flex flex-1">

//         {/* Sidebar */}
//         <div className="w-64 bg-[#252526] border-r border-gray-700 p-4">
//           <h4 className="mb-4 text-gray-300">
//             Participants ({participants.length})
//           </h4>

//           <ul className="space-y-2">
//             {participants.map((user) => (
//               <li
//                 key={user.userId}
//                 className="bg-[#2d2d2d] px-3 py-2 rounded-md"
//               >
//                 {user.name}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Editor */}
//         <div className="flex-1">
//           <Editor
//             height="100%"
//             language="javascript"
//             value={code}
//             onChange={handleEditorChange}
//             theme="vs-dark"
//             options={{
//               minimap: { enabled: false },
//               automaticLayout: true,
//             }}
//           />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default RoomEditor;

import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const RoomEditor = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const socketRef = useRef(null);
  const saveTimeout = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const token = localStorage.getItem("token");

  // 🔹 Setup socket connection
  useEffect(() => {
    const socket = io("http://localhost:3000", {
      auth: { token },
    });

    socketRef.current = socket;

    socket.emit("join-room", roomId);

    // 🔥 Load initial saved code
    socket.on("load-code", (savedCode) => {
      setCode(savedCode);
    });

    // 🔥 Receive real-time updates
    socket.on("receive-code", (newCode) => {
      setCode(newCode);
    });

    socket.on("load-language", (lang) => {
      setLanguage(lang);
    });

    socket.on("receive-language", (lang) => {
      setLanguage(lang);
    });

    // 🔥 Active participants
    socket.on("active-users", (users) => {
      setParticipants(users);
    });

    return () => {
      socket.emit("leave-room", roomId);
      socket.disconnect();
    };
  }, [roomId, token]);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);

    socketRef.current.emit("language-change", {
      roomId,
      language: selectedLang,
    });
  };

  // 🔹 Handle editor change
  const handleEditorChange = (value) => {
    setCode(value);

    // 🔥 Emit to other users
    socketRef.current.emit("code-change", {
      roomId,
      code: value,
    });

    // 🔥 Auto-save to DB (debounced)
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      try {
        await axios.put(
          `http://localhost:3000/room/${roomId}/code`,
          { code: value },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {
        console.log("Save failed");
      }
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
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
            className="bg-[#2d2d2d] hover:bg-[#333] border border-gray-600 px-2 py-1 rounded-md text-xs transition"
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
          onClick={() => navigate("/dashboard")}
          className="bg-red-600 hover:bg-red-700 hover:scale-105 transition px-4 py-1 rounded-md text-sm shadow-md"
        >
          Leave
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[#252526] border-r border-gray-700 p-4 flex flex-col">
          <h4 className="text-md font-semibold mb-4 text-gray-300">
            Participants ({participants.length})
          </h4>

          <ul className="space-y-2 overflow-y-auto">
            {/* {participants.map((user) => (
              <li
                key={user.userId}
                className="bg-[#2d2d2d] px-3 py-2 rounded-md hover:bg-[#333] transition"
              >
                {user.name}
              </li>
            ))} */}
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
        <div className="flex-1">
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
      </div>
    </div>
  );
};

export default RoomEditor;
