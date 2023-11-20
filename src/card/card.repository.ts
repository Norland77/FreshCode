import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('card')
export class CardRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createCard(title: string, listId: string) {
    return this.prismaService.card.create({
      data: {
        title,
        listId,
        description: '',
      },
    });
  }

  findCardById(id: string) {
    return this.prismaService.card.findFirst({
      where: {
        id,
      },
    });
  }

  updateCard(
    id: string,
    title: string | undefined,
    description: string | undefined,
  ) {
    return this.prismaService.card.update({
      where: {
        id,
      },
      data: {
        title,
        description,
      },
    });
  }

  moveCard(id: string, listId: string) {
    return this.prismaService.card.update({
      where: {
        id,
      },
      data: {
        listId,
      },
    });
  }

  deleteCard(id: string) {
    return this.prismaService.card.delete({
      where: {
        id,
      },
    });
  }
}
