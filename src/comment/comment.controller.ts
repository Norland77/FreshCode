import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { BoardService } from '../board/board.service';
import { CardService } from '../card/card.service';
import { UserService } from '../user/user.service';
import { Cookie } from '../../libs/common/src/decorators';
import { CommentDto } from './dto/comment.dto';
import { ActivityType } from '@prisma/client';
import { ActivityService } from '../activity/activity.service';
const REFRESH_TOKEN = 'refreshtoken';
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly boardService: BoardService,
    private readonly cardService: CardService,
    private readonly userService: UserService,
    private readonly activityService: ActivityService,
  ) {}

  @Post('create/:BoardId/:CardId')
  async createComment(
    @Param('BoardId') boardId: string,
    @Param('CardId') cardId: string,
    @Cookie(REFRESH_TOKEN) refreshtoken: string,
    @Body() dto: CommentDto,
  ) {
    const card = await this.cardService.findCardById(cardId);

    if (!card) {
      throw new BadRequestException(`Card with id ${cardId} is not exist`);
    }

    const board = await this.boardService.findBoardById(boardId);

    if (!board) {
      throw new BadRequestException(`Board with id ${boardId} is not exist`);
    }

    const userByToken = await this.userService.findUserByToken(refreshtoken);

    if (!userByToken) {
      throw new BadRequestException();
    }

    const user = await this.userService.findUserById(userByToken.userId);

    if (!user) {
      throw new BadRequestException();
    }

    const createdComment = await this.commentService.createComment(
      cardId,
      dto.text,
      user.id,
    );

    if (!createdComment) {
      throw new BadRequestException();
    }

    const activityDesc = `${user.email} add comment to card '${card.title}'`;

    return this.activityService.createActivity(
      user.id,
      boardId,
      activityDesc,
      ActivityType.ADD_COMMENT,
    );
  }
}
