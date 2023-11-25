import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';
import { Cookie } from '../../libs/common/src/decorators';
import { UserService } from '../user/user.service';
const REFRESH_TOKEN = 'refreshtoken';

@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly userService: UserService,
  ) {}

  @Post('create')
  async createBoard(
    @Body() dto: BoardDto,
    @Cookie(REFRESH_TOKEN) refreshtoken: string,
  ) {
    const user = await this.userService.findUserByToken(refreshtoken);

    if (!user) {
      throw new BadRequestException();
    }

    const board = await this.boardService.findBoardByTitle(dto.title);

    if (board) {
      throw new BadRequestException(
        `Board with title ${dto.title} is already use`,
      );
    }

    return this.boardService.createBoard(dto.title, user.userId);
  }

  @Delete('delete/:Id')
  async deleteBoardById(@Param('Id') id: string) {
    const board = await this.boardService.findBoardById(id);

    if (!board) {
      throw new BadRequestException(`Board with id ${id} is not exist`);
    }

    return this.boardService.deleteBoardById(id);
  }

  @Put('update/:Id')
  async updateBoardById(@Param('Id') id: string, @Body() dto: BoardDto) {
    const board = await this.boardService.findBoardById(id);

    if (!board) {
      throw new BadRequestException(`Board with id ${id} is not exist`);
    }

    return this.boardService.updateBoardById(id, dto.title);
  }

  @Get('all')
  async getAllBoard() {
    return this.boardService.getAllBoard();
  }

  @Get('/:Id')
  async getBoardById(@Param('Id') id: string) {
    const board = await this.boardService.findBoardById(id);

    if (!board) {
      throw new BadRequestException(`Board with id ${id} is not exist`);
    }

    return this.boardService.findBoardById(id);
  }
}
