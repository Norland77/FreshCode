import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityType } from '@prisma/client';

@Controller('activity')
export class ActivityRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getAllActivityByBoardId(id: string) {
    return this.prismaService.activity.findMany({
      where: {
        boardId: id,
      },
    });
  }

  createActivity(
    userId: string,
    boardId: string,
    description: string,
    type: ActivityType,
  ) {
    return this.prismaService.activity.create({
      data: {
        boardId,
        userId,
        description,
        type,
      },
    });
  }
}
