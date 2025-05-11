import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import chatRoomRoutes from './routes/chatRoomRoutes';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  methods: ["GET", "POST"],
  credentials: true
};

const io = new Server(httpServer, {
  cors: corsOptions
});

const prisma = new PrismaClient();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/chat-rooms', chatRoomRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Chat API is running' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('leave_room', (roomId: string) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
  });

  socket.on('send_message', async (data: { roomId: string; username: string; content: string }) => {
    try {
      console.log('Received message:', data);
      
      // Find or create user
      let user = await prisma.user.findFirst({
        where: { username: data.username }
      });

      if (!user) {
        user = await prisma.user.create({
          data: { username: data.username }
        });
      }

      const message = await prisma.message.create({
        data: {
          content: data.content,
          userId: user.id,
          chatRoomId: data.roomId,
        },
        include: {
          user: true,
        },
      });

      console.log('Created message:', message);
      io.to(data.roomId).emit('receive_message', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 