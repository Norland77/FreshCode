import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { ActivityRepository } from './activity.repository';
import { ActivityType } from '@prisma/client';

describe('ActivityService', () => {
  let service: ActivityService;
  let activityRepository: ActivityRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: ActivityRepository,
          useValue: {
            getAllActivityByBoardId: jest.fn(),
            createActivity: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
    activityRepository = module.get<ActivityRepository>(ActivityRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllActivityByBoardId', () => {
    it('should call activityRepository.getAllActivityByBoardId with the provided id', async () => {
      const boardId = 'valid-board-id';
      const mockActivities = [
        {
          id: '',
          userId: '',
          boardId: '',
          description: '',
          type: ActivityType.ADD_COMMENT,
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(activityRepository, 'getAllActivityByBoardId')
        .mockResolvedValueOnce(mockActivities);

      const result = await service.getAllActivityByBoardId(boardId);

      expect(activityRepository.getAllActivityByBoardId).toHaveBeenCalledWith(
        boardId,
      );
      expect(result).toEqual(mockActivities);
    });
  });

  describe('createActivity', () => {
    it('should call activityRepository.createActivity with the provided parameters', async () => {
      const userId = 'user-id';
      const boardId = 'board-id';
      const description = 'Activity description';
      const type: ActivityType = ActivityType.ADD_COMMENT;

      const mockCreatedActivity = {
        id: '',
        userId: '',
        boardId: '',
        description: '',
        type: ActivityType.ADD_COMMENT,
        createdAt: new Date(),
      };

      jest
        .spyOn(activityRepository, 'createActivity')
        .mockResolvedValueOnce(mockCreatedActivity);

      const result = await service.createActivity(
        userId,
        boardId,
        description,
        type,
      );

      expect(activityRepository.createActivity).toHaveBeenCalledWith(
        userId,
        boardId,
        description,
        type,
      );
      expect(result).toEqual(mockCreatedActivity);
    });
  });
});
