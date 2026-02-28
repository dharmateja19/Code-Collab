import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/room.js";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { roomSocket } from "./sockets/roomSocket.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "https://code-collab-dusky-pi.vercel.app"

const allowedOrigins = ["http://localhost:5173", FRONTEND_URL];

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS error: Origin not allowed by CORS policy"));
      }
    },
    credentials: true,
  }),
);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

roomSocket(io);

app.get("/", (req, res) => {
  res.send("Hello from server...");
});

app.use("/auth", authRoutes);
app.use("/room", roomRoutes);

server.listen(PORT, () => {
  connectDB();
  console.log(`server is running on http://localhost:${PORT}`);
});
