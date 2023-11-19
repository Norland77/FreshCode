import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ListService } from './list.service';
import { ActivityService } from '../activity/activity.service';
import { ListDto } from './dto/list.dto';
import { BoardService } from '../board/board.service';
import { Cookie } from '../../libs/common/src/decorators';
import { UserService } from '../user/user.service';
import { ActivityType } from '@prisma/client';
const REFRESH_TOKEN = 'refreshtoken';
@Controller('list')
export class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly activityService: ActivityService,
    private readonly boardService: BoardService,
    private readonly userService: UserService,
  ) {}

  @Post('create/:Id')
  async createList(
    @Param('Id') boardId: string,
    @Body() dto: ListDto,
    @Cookie(REFRESH_TOKEN) refreshtoken: string,
  ) {
    const board = await this.boardService.findBoardById(boardId);

    if (!board) {
      throw new BadRequestException(`Board with id ${boardId} is not exist`);
    }

    const list = await this.listService.findListByTitleAndBoard(
      boardId,
      dto.title,
    );

    if (list) {
      throw new BadRequestException(
        `A list with a title ${dto.title} already exists in the board with id ${boardId}`,
      );
    }

    const createdList = await this.listService.createList(boardId, dto.title);

    if (!createdList) {
      throw new BadRequestException(
        `Can't created list with data ${JSON.stringify(dto)}`,
      );
    }

    const userByToken = await this.userService.findUserByToken(refreshtoken);

    if (!userByToken) {
      throw new BadRequestException();
    }

    const user = await this.userService.findUserById(userByToken.userId);

    if (!user) {
      throw new BadRequestException();
    }

    const activityDesc = `${user.email} added list '${dto.title}'`;

    return this.activityService.createActivity(
      user.id,
      boardId,
      activityDesc,
      ActivityType.ADD_LIST,
    );
  }

  @Put('edit/:BoardId/:ListId')
  async editListById(
    @Param('BoardId') boardId: string,
    @Param('ListId') listId: string,
    @Body() dto: ListDto,
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

    const listExists = await this.listService.findListByTitleAndBoard(
      boardId,
      dto.title,
    );

    if (listExists) {
      throw new BadRequestException(
        `A list with a title ${dto.title} already exists in the board with id ${boardId}`,
      );
    }

    const editedList = await this.listService.editListById(listId, dto.title);

    if (!editedList) {
      throw new BadRequestException(
        `Can't edit list with data ${JSON.stringify(dto)}`,
      );
    }

    const userByToken = await this.userService.findUserByToken(refreshtoken);

    if (!userByToken) {
      throw new BadRequestException();
    }

    const user = await this.userService.findUserById(userByToken.userId);

    if (!user) {
      throw new BadRequestException();
    }

    const activityDesc = `${user.email} change title list '${list.title}' on '${dto.title}'`;

    return this.activityService.createActivity(
      user.id,
      boardId,
      activityDesc,
      ActivityType.EDIT_LIST,
    );
  }

  @Delete('delete/:BoardId/:ListId')
  async deleteList(
    @Param('BoardId') boardId: string,
    @Param('ListId') listId: string,
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

    const deleteList = await this.listService.deleteList(listId);

    if (!deleteList) {
      throw new BadRequestException(`Can't delete list`);
    }

    const userByToken = await this.userService.findUserByToken(refreshtoken);

    if (!userByToken) {
      throw new BadRequestException();
    }

    const user = await this.userService.findUserById(userByToken.userId);

    if (!user) {
      throw new BadRequestException();
    }

    const activityDesc = `${user.email} delete list '${list.title}'`;

    return this.activityService.createActivity(
      user.id,
      boardId,
      activityDesc,
      ActivityType.DELETE_LIST,
    );
  }
}
