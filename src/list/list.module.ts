import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { ListRepository } from './list.repository';
import { ActivityModule } from '../activity/activity.module';
import { BoardModule } from '../board/board.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [ListService, ListRepository],
  controllers: [ListController, ListRepository],
  imports: [ActivityModule, BoardModule, UserModule],
})
export class ListModule {}
