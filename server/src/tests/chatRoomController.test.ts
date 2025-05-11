import { Request, Response } from 'express';
import { chatRoomController } from '../controllers/chatRoomController';
import { PrismaClient } from '@prisma/client';

// Мокаем PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    chatRoom: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe('ChatRoomController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockPrisma: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockPrisma = new PrismaClient();
  });

  describe('getAllChatRooms', () => {
    it('should return all chat rooms', async () => {
      const mockChatRooms = [
        { id: '1', name: 'Room 1' },
        { id: '2', name: 'Room 2' },
      ];

      mockPrisma.chatRoom.findMany.mockResolvedValue(mockChatRooms);

      await chatRoomController.getAllChatRooms(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPrisma.chatRoom.findMany).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockChatRooms);
    });

    it('should handle errors', async () => {
      mockPrisma.chatRoom.findMany.mockRejectedValue(new Error('Database error'));

      await chatRoomController.getAllChatRooms(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to fetch chat rooms',
      });
    });
  });
}); 