import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { BoardRepository } from './board.repository';
import { UserModule } from '../user/user.module';

@Module({
  providers: [BoardService, BoardRepository],
  controllers: [BoardController, BoardRepository],
  imports: [UserModule],
  exports: [BoardService],
})
export class BoardModule {}
