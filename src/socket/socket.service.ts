import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
// import { pollController } from "../controllers/poll.controller.js";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5001"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket"],
  });

  io.on("connection", (socket: Socket) => {
    console.log("⚡ New connection:", socket.id);

    // Attach your controllers here
    // pollController(io, socket);
  });

  return io;
};

// Helper: Send updates from ANYWHERE in your app (like a background job)
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
