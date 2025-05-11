import request from 'supertest';
import express from 'express';
import chatRoomRoutes from '../routes/chatRoomRoutes';
import { PrismaClient } from '@prisma/client';

// Мокаем PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    chatRoom: {
      findMany: jest.fn().mockResolvedValue([
        { id: '1', name: 'General Chat' },
        { id: '2', name: 'Tech Discussion' }
      ]),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    }
  }))
}));

describe('Chat API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/chat-rooms', chatRoomRoutes);
  });

  describe('GET /api/chat-rooms', () => {
    it('should return list of chat rooms', async () => {
      const response = await request(app)
        .get('/api/chat-rooms')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('name', 'General Chat');
    });
  });
}); 