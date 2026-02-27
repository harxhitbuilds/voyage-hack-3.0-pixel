import http from "http";
import { Server as SocketIO } from "socket.io";
import app from "./src/app.js";
import connect from "./src/config/database.js";
import { setupSocketHandlers } from "./src/socket/chat.socket.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

// Create HTTP server & attach Socket.io
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://pixel-symbiosis-skill-hackathon.onrender.com",
      "https://pixel-symbiosis-skill-hackathon.vercel.app",
    ],
    credentials: true,
  },
});

// Wire up real-time chat handlers
setupSocketHandlers(io);

connect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Socket.io attached and listening`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
  });
