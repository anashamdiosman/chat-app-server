import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080; // ✅ Use a fallback if PORT is undefined

const server = createServer(app); // ✅ Create HTTP server
const io = new Server(server, {
  // ✅ Attach Socket.io to the same server
  cors: {
    origin: "http://localhost:5173", // ✅ Remove trailing slash
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Corrected socket connection handling
io.on("connection", (socket) => {
  const clientInfo = {
    socketId: socket.id,
    connectedAt: new Date(),
    ipAddress: socket.handshake.address,
    userAgent: socket.handshake.headers["user-agent"], // Client browser/device info
    authToken: socket.handshake.auth?.token || null, // If using authentication
  };

  socket.emit("connected", {
    clientInfo,
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Ensure the same server is listening for both HTTP and WebSocket
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
