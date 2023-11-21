import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { CardRepository } from './card.repository';
import { UserModule } from '../user/user.module';
import { BoardModule } from '../board/board.module';
import { ListModule } from '../list/list.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  providers: [CardService, CardRepository],
  controllers: [CardController, CardRepository],
  imports: [UserModule, BoardModule, ListModule, ActivityModule],
  exports: [CardService],
})
export class CardModule {}
