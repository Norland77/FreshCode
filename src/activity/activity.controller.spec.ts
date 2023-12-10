import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { BoardService } from '../board/board.service';
import { BadRequestException } from '@nestjs/common';
import { ActivityType } from '@prisma/client';
import { ActivityRepository } from './activity.repository';
import { BoardRepository } from '../board/board.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('ActivityController', () => {
  let controller: ActivityController;
  let activityService: ActivityService;
  let boardService: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        ActivityService,
        BoardService,
        ActivityRepository,
        BoardRepository,
        PrismaService,
      ],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
    activityService = module.get<ActivityService>(ActivityService);
    boardService = module.get<BoardService>(BoardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllActivityByBoardId', () => {
    it('should return activity array if board exists', async () => {
      const boardId = 'valid-board-id';
      const activityArray = [
        {
          id: '',
          userId: '',
          boardId: '',
          description: '',
          type: ActivityType.ADD_COMMENT,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(boardService, 'findBoardById').mockResolvedValueOnce({
        id: '',
        title: '',
        userId: '',
      });
      jest
        .spyOn(activityService, 'getAllActivityByBoardId')
        .mockResolvedValueOnce(activityArray);

      const result = await controller.getAllActivityByBoardId(boardId);

      expect(boardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(activityService.getAllActivityByBoardId).toHaveBeenCalledWith(
        boardId,
      );
      expect(result).toEqual(activityArray);
    });

    it('should throw BadRequestException if board does not exist', async () => {
      const boardId = 'invalid-board-id';

      jest.spyOn(boardService, 'findBoardById').mockResolvedValueOnce(null);
      jest.spyOn(activityService, 'getAllActivityByBoardId');

      await expect(controller.getAllActivityByBoardId(boardId)).rejects.toThrow(
        BadRequestException,
      );
      expect(boardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(activityService.getAllActivityByBoardId).not.toHaveBeenCalled();
    });
  });
});
