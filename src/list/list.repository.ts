import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('list')
export class ListRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findListByTitleAndBoard(boardId: string, title: string) {
    return this.prismaService.list.findFirst({
      where: {
        AND: { boardId, title },
      },
    });
  }

  createList(boardId: string, title: string) {
    return this.prismaService.list.create({
      data: {
        boardId,
        title,
      },
    });
  }

  editListById(listId: string, title: string) {
    return this.prismaService.list.update({
      where: {
        id: listId,
      },
      data: {
        title,
      },
    });
  }

  findListById(id: string) {
    return this.prismaService.list.findFirst({
      where: {
        id,
      },
    });
  }

  deleteList(id: string) {
    return this.prismaService.list.delete({
      where: {
        id,
      },
    });
  }

  getAllLists(boardId: string) {
    return this.prismaService.list.findMany({
      where: {
        boardId,
      },
      select: {
        id: true,
        title: true,
        cards: {
          select: {
            title: true,
            description: true,
            listId: true,
            id: true,
            comments: {
              select: {
                user: {
                  select: {
                    username: true,
                  },
                },
                text: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
