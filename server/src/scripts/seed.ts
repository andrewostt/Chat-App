import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      username: 'JohnDoe',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'JaneSmith',
    },
  });

  // Create sample chat rooms
  const generalRoom = await prisma.chatRoom.create({
    data: {
      name: 'General Chat',
    },
  });

  const techRoom = await prisma.chatRoom.create({
    data: {
      name: 'Tech Discussion',
    },
  });

  // Create sample messages
  await prisma.message.create({
    data: {
      content: 'Hello everyone! Welcome to the general chat.',
      userId: user1.id,
      chatRoomId: generalRoom.id,
    },
  });

  await prisma.message.create({
    data: {
      content: 'Hi! Thanks for the welcome.',
      userId: user2.id,
      chatRoomId: generalRoom.id,
    },
  });

  await prisma.message.create({
    data: {
      content: 'What are you working on today?',
      userId: user1.id,
      chatRoomId: techRoom.id,
    },
  });

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 