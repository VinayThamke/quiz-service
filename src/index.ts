import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Poll } from './types.js';

const app = express();
const PORT = 4000;

// 1. Express Middleware
// app.use(cors({
//   origin: ["http://localhost:5173", "http://localhost:5001"],
//   credentials: true
// }));
app.use(express.json());

// 2. Mock Database
let currentPoll: Poll = {
  id: 'poll-123',
  question: 'Which SQL database is your favorite?',
  options: [
    { id: 'opt-1', text: 'PostgreSQL', votes: 0 },
    { id: 'opt-2', text: 'MySQL', votes: 0 },
    { id: 'opt-3', text: 'SQLite', votes: 0 }
  ]
};

// Standard Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Quiz Service is healthy' });
});


// 3. Server Setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5001"],
    methods: ["GET", "POST"],
    credentials: true
  },
  // ADD THIS: Fixes the "Pending" status by forcing WebSockets
  transports: ['websocket'] 
});

// 4. Socket Events
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // Send initial data
  socket.emit('poll-update', currentPoll);

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// 5. Start Server
httpServer.listen(PORT, () => {
  console.log(`🚀 Quiz Service running on http://localhost:${PORT}`);
});