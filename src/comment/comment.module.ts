import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { UserModule } from '../user/user.module';
import { BoardModule } from '../board/board.module';
import { CardModule } from '../card/card.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  providers: [CommentService, CommentRepository],
  controllers: [CommentController, CommentRepository],
  imports: [UserModule, BoardModule, CardModule, ActivityModule],
})
export class CommentModule {}
