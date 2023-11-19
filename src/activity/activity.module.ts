import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { ActivityRepository } from './activity.repository';
import { BoardModule } from '../board/board.module';

@Module({
  providers: [ActivityService, ActivityRepository],
  controllers: [ActivityController, ActivityRepository],
  imports: [BoardModule],
  exports: [ActivityService],
})
export class ActivityModule {}
