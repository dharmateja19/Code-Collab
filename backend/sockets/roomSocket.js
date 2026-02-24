import jwt from "jsonwebtoken";
import Room from "../models/Room.js";

const activeRooms = {};

export const roomSocket = (io) => {
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
    console.log("User connected: ", socket.user.id);

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
          return socket.emit("error", "unauthorized");
        }

        socket.join(roomId);

        if (!activeRooms[roomId]) {
          activeRooms[roomId] = [];
        }

        const alreadyExists = activeRooms[roomId].some(
          (user) => user.userId === socket.user.id,
        );

        if (!alreadyExists) {
          activeRooms[roomId].push({
            userId: socket.user.id,
            name: socket.user.name,
          });
        }

        io.to(roomId).emit("active-users", activeRooms[roomId]);

        io.to(roomId).emit("active-users", activeRooms[roomId]);

        socket.emit("load-code", room.code);
      } catch (error) {
        socket.emit("error", "join failed");
      }
    });

    socket.on("code-change", async ({ roomId, code }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;

        const isParticipant = room.participants.some(
          (p) => p.user.toString() === socket.user.id,
        );

        if (!isParticipant) {
          return socket.emit("error", "not authorized");
        }

        await Room.findOneAndUpdate({ roomId }, { code });
        socket.to(roomId).emit("receive-code", code);
      } catch (error) {
        socket.emit("error", "code update failed");
      }
    });

    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      if (activeRooms[roomId]) {
        activeRooms[roomId] = activeRooms[roomId].filter(
          (user) => user.userId !== socket.user.id,
        );

        io.to(roomId).emit("active-users", activeRooms[roomId]);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.user.id);

      for (const roomId in activeRooms) {
        activeRooms[roomId] = activeRooms[roomId].filter(
          (id) => id !== socket.user.id,
        );

        io.to(roomId).emit("active-users", activeRooms[roomId]);
      }
    });
  });
};
