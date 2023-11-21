import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('comment')
export class CommentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createComment(cardId: string, text: string, userId: string) {
    return this.prismaService.comments.create({
      data: {
        text,
        cardId,
        userId,
      },
    });
  }
}
