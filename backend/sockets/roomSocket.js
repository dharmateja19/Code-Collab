import jwt from "jsonwebtoken";
import Room from "../models/Room.js";
import Message from "../models/Message.js";

const activeRooms = {};

export const roomSocket = (io) => {
  // 🔐 Auth middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {

    // Join Room
    socket.on("join-room", async (roomId) => {
      try {
        const room = await Room.findOne({ roomId });

        if (!room) {
          return socket.emit("error", "Room not found");
        }

        const isParticipant = room.participants.some(
          (p) => p.user.toString() === socket.user.id,
        );

        if (!isParticipant) {
          return socket.emit("error", "Unauthorized");
        }

        socket.join(roomId);

        if (!activeRooms[roomId]) {
          activeRooms[roomId] = [];
        }

        const alreadyExists = activeRooms[roomId].some(
          (user) => user.userId === socket.user.id,
        );

        const participant = room.participants.find(
          (p) => p.user.toString() === socket.user.id,
        );

        if (!alreadyExists) {
          activeRooms[roomId].push({
            userId: socket.user.id,
            name: socket.user.name,
            role: participant.role,
          });
        }

        io.to(roomId).emit("active-users", activeRooms[roomId]);

        socket.emit("load-code", room.code);
        socket.emit("load-language", room.language);

        const messages = await Message.find({ roomId }).lean();
        socket.emit("load-messages", messages);
      } catch (error) {
        socket.emit("error", "Join failed");
      }
    });

    // Real-time Code Sync
    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("receive-code", code);
    });

    // Leave Room
    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);

      if (activeRooms[roomId]) {
        activeRooms[roomId] = activeRooms[roomId].filter(
          (user) => user.userId !== socket.user.id,
        );

        io.to(roomId).emit("active-users", activeRooms[roomId]);
      }
    });

    // On Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.id);

      for (const roomId in activeRooms) {
        activeRooms[roomId] = activeRooms[roomId].filter(
          (user) => user.userId !== socket.user.id,
        );

        io.to(roomId).emit("active-users", activeRooms[roomId]);
      }
    });

    socket.on("language-change", async ({ roomId, language }) => {
      try {
        await Room.findOneAndUpdate({ roomId }, { language });

        socket.to(roomId).emit("receive-language", language);
      } catch (error) {
        socket.emit("error", "Language update failed");
      }
    });

    socket.on("send-message", async ({ roomId, message }) => {
      if (!message.trim()) return;
      try {
        const messageData = await Message.create({
          roomId,
          userId: socket.user.id,
          username: socket.user.name,
          message,
          type: "text",
        });
        io.to(roomId).emit("receive-message", messageData);
      } catch (error) {
        socket.emit("error", "Failed to send message");
      }
    });
  });
};
