import {
  BadRequestException,
  Body,
  Controller, Delete,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { CardService } from './card.service';
import { Cookie } from '../../libs/common/src/decorators';
import { ListService } from '../list/list.service';
import { ActivityService } from '../activity/activity.service';
import { BoardService } from '../board/board.service';
import { UserService } from '../user/user.service';
import { ActivityType } from '@prisma/client';
import { CardCreateDto } from './dto/card-create.dto';
import { CardUpdateDto } from './dto/card-update.dto';
const REFRESH_TOKEN = 'refreshtoken';
@Controller('card')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly listService: ListService,
    private readonly activityService: ActivityService,
    private readonly boardService: BoardService,
    private readonly userService: UserService,
  ) {}

  @Post('create/:BoardId/:ListId')
  async createCard(
    @Param('BoardId') boardId: string,
    @Param('ListId') listId: string,
    @Body() dto: CardCreateDto,
    @Cookie(REFRESH_TOKEN) refreshtoken: string,
  ) {
    const board = await this.boardService.findBoardById(boardId);

    if (!board) {
      throw new BadRequestException(`Board with id ${boardId} is not exist`);
    }

    const list = await this.listService.findListById(listId);

    if (!list) {
      throw new BadRequestException(`List with id ${listId} is not exist`);
    }

    const createdCard = await this.cardService.createCard(dto.title, listId);

    if (!createdCard) {
      throw new BadRequestException();
    }

    const userByToken = await this.userService.findUserByToken(refreshtoken);

    if (!userByToken) {
      throw new BadRequestException();
    }

    const user = await this.userService.findUserById(userByToken.userId);

    if (!user) {
      throw new BadRequestException();
    }

    const activityDesc = `${user.email} add card '${dto.title}' in list '${list.title}'`;

    return this.activityService.createActivity(
      user.id,
      boardId,
      activityDesc,
      ActivityType.ADD_CARD,
    );
  }

  @Put('update/:BoardId/:CardId')
  async updateCard(
    @Param('BoardId') boardId: string,
    @Param('CardId') cardId: string,
    @Body() dto: CardUpdateDto,
    @Cookie(REFRESH_TOKEN) refreshtoken: string,
  ) {
    const card = await this.cardService.findCardById(cardId);

    if (!card) {
      throw new BadRequestException(`Card with id ${cardId} is not exist`);
    }

    const board = await this.boardService.findBoardById(boardId);

    if (!board) {
      throw new BadRequestException(`Board with id ${boardId} is not exist`);
    }

    const updatedCard = await this.cardService.updateCard(
      cardId,
      dto.title,
      dto.description,
    );

    if (!updatedCard) {
      throw new BadRequestException();
    }

    const userByToken = await this.userService.findUserByToken(refreshtoken);

    if (!userByToken) {
      throw new BadRequestException();
    }

    const user = await this.userService.findUserById(userByToken.userId);

    if (!user) {
      throw new BadRequestException();
    }

    const activityDesc = `${user.email} edit card '${dto.title}'`;

    return this.activityService.createActivity(
      user.id,
      boardId,
      activityDesc,
      ActivityType.EDIT_CARD,
    );
  }

  @Put('move/:BoardId/:CardId/:ListId')
  async moveCard(
    @Param('BoardId') boardId: string,
    @Param('CardId') cardId: string,
    @Param('ListId') listId: string,
    @Cookie(REFRESH_TOKEN) refreshtoken: string,
  ) {
    const card = await this.cardService.findCardById(cardId);

    if (!card) {
      throw new BadRequestException(`Card with id ${cardId} is not exist`);
    }

    const board = await this.boardService.findBoardById(boardId);

    if (!board) {
      throw new BadRequestException(`Board with id ${boardId} is not exist`);
    }

    const list = await this.listService.findListById(listId);

    if (!list || list.id === card.listId) {
      throw new BadRequestException(`List with id ${listId} is not exist`);
    }

    const movedCard = await this.cardService.moveCard(cardId, listId);

    if (!movedCard) {
      throw new BadRequestException();
    }

    const userByToken = await this.userService.findUserByToken(refreshtoken);

    if (!userByToken) {
      throw new BadRequestException();
    }

    const user = await this.userService.findUserById(userByToken.userId);

    if (!user) {
      throw new BadRequestException();
    }

    const activityDesc = `${user.email} move card '${card.title}' in list '${list.title}'`;

    return this.activityService.createActivity(
      user.id,
      boardId,
      activityDesc,
      ActivityType.MOVE_CARD,
    );
  }

  @Delete('delete/:BoardId/:CardId')
  async deleteCard(
    @Param('BoardId') boardId: string,
    @Param('CardId') cardId: string,
    @Cookie(REFRESH_TOKEN) refreshtoken: string,
  ) {
    const card = await this.cardService.findCardById(cardId);

    if (!card) {
      throw new BadRequestException(`Card with id ${cardId} is not exist`);
    }

    const board = await this.boardService.findBoardById(boardId);

    if (!board) {
      throw new BadRequestException(`Board with id ${boardId} is not exist`);
    }

    const deletedCard = await this.cardService.deleteCard(cardId);

    if (!deletedCard) {
      throw new BadRequestException();
    }

    const userByToken = await this.userService.findUserByToken(refreshtoken);

    if (!userByToken) {
      throw new BadRequestException();
    }

    const user = await this.userService.findUserById(userByToken.userId);

    if (!user) {
      throw new BadRequestException();
    }

    const activityDesc = `${user.email} delete card '${card.title}''`;

    return this.activityService.createActivity(
      user.id,
      boardId,
      activityDesc,
      ActivityType.DELETE_CARD,
    );
  }
}
