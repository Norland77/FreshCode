import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('board')
export class BoardRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findBoardByTitle(title: string) {
    return this.prismaService.board.findFirst({
      where: {
        title,
      },
    });
  }

  createBoard(title: string, userId: string) {
    return this.prismaService.board.create({
      data: {
        title,
        userId,
      },
    });
  }

  findBoardById(id: string) {
    return this.prismaService.board.findFirst({
      where: {
        id,
      },
    });
  }

  deleteBoardById(id: string) {
    return this.prismaService.board.delete({
      where: {
        id,
      },
    });
  }

  updateBoardById(id: string, title: string) {
    return this.prismaService.board.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });
  }

  getAllBoard() {
    return this.prismaService.board.findMany();
  }
}
