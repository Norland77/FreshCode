import { Injectable } from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { ActivityType } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  getAllActivityByBoardId(id: string) {
    return this.activityRepository.getAllActivityByBoardId(id);
  }

  createActivity(
    userId: string,
    boardId: string,
    description: string,
    type: ActivityType,
  ) {
    return this.activityRepository.createActivity(
      userId,
      boardId,
      description,
      type,
    );
  }
}
