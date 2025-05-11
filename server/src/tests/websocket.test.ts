import { Server } from 'socket.io';
import { createServer } from 'http';
import { io as Client } from 'socket.io-client';
import { PrismaClient } from '@prisma/client';

// Мокаем PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    chatRoom: {
      findUnique: jest.fn().mockResolvedValue({ id: '1', name: 'Test Room' })
    },
    message: {
      create: jest.fn(),
      findMany: jest.fn().mockResolvedValue([])
    }
  }))
}));

describe('WebSocket Connection', () => {
  let httpServer: any;
  let ioServer: Server;
  let clientSocket: any;
  let serverSocket: any;

  beforeAll((done) => {
    httpServer = createServer();
    ioServer = new Server(httpServer);
    
    ioServer.on('connection', (socket) => {
      serverSocket = socket;
      
      socket.on('join_room', (data) => {
        socket.join(data.roomId);
        socket.emit('room_joined', { roomId: data.roomId });
      });

      socket.on('send_message', (message) => {
        ioServer.to(message.roomId).emit('new_message', message);
      });
    });

    httpServer.listen(() => {
      const port = (httpServer.address() as any).port;
      clientSocket = Client(`http://localhost:${port}`);
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    ioServer.close();
    clientSocket.close();
  });

  it('should connect to chat room', (done) => {
    clientSocket.emit('join_room', { roomId: '1' });
    
    clientSocket.on('room_joined', (data: any) => {
      expect(data.roomId).toBe('1');
      done();
    });
  });

  it('should send and receive messages', (done) => {
    const message = {
      text: 'Hello, World!',
      roomId: '1',
      username: 'TestUser'
    };

    clientSocket.emit('send_message', message);

    clientSocket.on('new_message', (data: any) => {
      expect(data.text).toBe(message.text);
      expect(data.username).toBe(message.username);
      done();
    });
  });
}); 