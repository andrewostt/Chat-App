import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const chatRoomController = {
  // Get all chat rooms
  async getAllChatRooms(req: Request, res: Response) {
    try {
      const chatRooms = await prisma.chatRoom.findMany({
        include: {
          messages: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });
      res.json(chatRooms);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat rooms' });
    }
  },

  // Get a single chat room with messages
  async getChatRoom(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const chatRoom = await prisma.chatRoom.findUnique({
        where: { id },
        include: {
          messages: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      if (!chatRoom) {
        return res.status(404).json({ error: 'Chat room not found' });
      }

      res.json(chatRoom);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat room' });
    }
  },

  // Create a new chat room
  async createChatRoom(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const chatRoom = await prisma.chatRoom.create({
        data: { name },
      });
      res.status(201).json(chatRoom);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create chat room' });
    }
  },

  // Delete a chat room
  async deleteChatRoom(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.chatRoom.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete chat room' });
    }
  },
}; 