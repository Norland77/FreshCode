import { PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
const prisma = new PrismaClient();

async function seed() {
  function hashPassword(password: string | undefined) {
    if (!password) {
      return '';
    }
    return hashSync(password, genSaltSync(10));
  }

  const hashedPassword = hashPassword('password1');
  // Seed Users
  const user1 = await prisma.user.create({
    data: {
      username: 'user1',
      email: 'user1@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user2',
      email: 'user2@example.com',
      password: hashedPassword,
    },
  });

  // Seed Boards
  const board1 = await prisma.board.create({
    data: {
      title: 'Board 1',
      userId: user1.id,
    },
  });

  // Seed Lists
  const list1 = await prisma.list.create({
    data: {
      title: 'List 1',
      boardId: board1.id,
    },
  });

  // Seed Cards
  const card1 = await prisma.card.create({
    data: {
      title: 'Card 1',
      description: 'Description 1',
      listId: list1.id,
    },
  });

  // Seed Comments
  const comment1 = await prisma.comments.create({
    data: {
      text: 'Comment 1',
      userId: user1.id,
      cardId: card1.id,
    },
  });

  console.log('Seed data inserted successfully');
}

seed()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
