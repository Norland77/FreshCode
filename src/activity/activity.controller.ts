import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { BoardService } from '../board/board.service';

@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly boardService: BoardService,
  ) {}

  @Get('all/:Id')
  async getAllActivityByBoardId(@Param('Id') id: string) {
    const board = await this.boardService.findBoardById(id);

    if (!board) {
      throw new BadRequestException(`Board with id ${id} is not exist`);
    }

    return this.activityService.getAllActivityByBoardId(id);
  }
}
