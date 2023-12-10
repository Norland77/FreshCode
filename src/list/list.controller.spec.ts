import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { ActivityService } from '../activity/activity.service';
import { BoardService } from '../board/board.service';
import { UserService } from '../user/user.service';
import { BadRequestException } from '@nestjs/common';
import { ListDto } from './dto/list.dto';
import { ActivityType } from '@prisma/client';

const mockListService = {
  findBoardById: jest.fn(),
  findListByTitleAndBoard: jest.fn(),
  createList: jest.fn(),
  findListById: jest.fn(),
  editListById: jest.fn(),
  deleteList: jest.fn(),
  getAllLists: jest.fn(),
};

const mockActivityService = {
  createActivity: jest.fn(),
};

const mockBoardService = {
  findBoardById: jest.fn(),
};

const mockUserService = {
  findUserByToken: jest.fn(),
  findUserById: jest.fn(),
};

describe('ListController', () => {
  let controller: ListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [
        { provide: ListService, useValue: mockListService },
        { provide: ActivityService, useValue: mockActivityService },
        { provide: BoardService, useValue: mockBoardService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<ListController>(ListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createList', () => {
    it('should create a list and return activity', async () => {
      const boardId = 'valid-board-id';
      const dto: ListDto = { title: 'New List' };
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = { id: boardId, title: '', userId: '' };
      const mockList = {
        id: 'list-id',
        title: dto.title,
        boardId: boardId,
        createdAt: new Date(),
      };
      const mockUser = { id: 'user-id', username: '', email: '', password: '' };
      const mockActivity = {
        id: '',
        userId: mockUser.id,
        boardId,
        description: '',
        type: ActivityType.ADD_LIST,
        createdAt: new Date(),
      };

      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockListService.findListByTitleAndBoard.mockResolvedValueOnce(null);
      mockListService.createList.mockResolvedValueOnce(mockList);
      mockUserService.findUserByToken.mockResolvedValueOnce({
        userId: mockUser.id,
      });
      mockUserService.findUserById.mockResolvedValueOnce(mockUser);
      mockActivityService.createActivity.mockResolvedValueOnce(mockActivity);

      const result = await controller.createList(boardId, dto, refreshtoken);

      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.findListByTitleAndBoard).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
      expect(mockListService.createList).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
      expect(mockUserService.findUserByToken).toHaveBeenCalledWith(
        refreshtoken,
      );
      expect(mockUserService.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(mockActivityService.createActivity).toHaveBeenCalledWith(
        mockUser.id,
        boardId,
        expect.stringContaining(`added list '${dto.title}'`),
        ActivityType.ADD_LIST,
      );
      expect(result).toEqual(mockActivity);
    });

    it('should throw BadRequestException if board does not exist', async () => {
      const boardId = 'invalid-board-id';
      const dto: ListDto = { title: 'New List' };
      const refreshtoken = 'valid-refresh-token';

      mockBoardService.findBoardById.mockResolvedValueOnce(null);

      await expect(
        controller.createList(boardId, dto, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
    });

    it('should throw BadRequestException if list with title already exists', async () => {
      const boardId = 'valid-board-id';
      const dto: ListDto = { title: 'Existing List' };
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = { id: boardId, title: '', userId: '' };
      const mockList = {
        id: 'existing-list-id',
        title: dto.title,
        boardId: boardId,
        createdAt: new Date(),
      };

      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockListService.findListByTitleAndBoard.mockResolvedValueOnce(mockList);

      await expect(
        controller.createList(boardId, dto, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.findListByTitleAndBoard).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
    });

    it('should throw BadRequestException if createList fails', async () => {
      const boardId = 'valid-board-id';
      const dto: ListDto = { title: 'New List' };
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = { id: boardId, title: '', userId: '' };

      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockListService.findListByTitleAndBoard.mockResolvedValueOnce(null);
      mockListService.createList.mockResolvedValueOnce(null);

      await expect(
        controller.createList(boardId, dto, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.findListByTitleAndBoard).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
      expect(mockListService.createList).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
    });

    it('should throw BadRequestException if findUserByToken fails', async () => {
      const boardId = 'valid-board-id';
      const dto: ListDto = { title: 'New List' };
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = { id: boardId, title: '', userId: '' };

      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockListService.findListByTitleAndBoard.mockResolvedValueOnce(null);
      mockListService.createList.mockResolvedValueOnce({});
      mockUserService.findUserByToken.mockResolvedValueOnce(null);

      await expect(
        controller.createList(boardId, dto, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.findListByTitleAndBoard).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
      expect(mockListService.createList).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
      expect(mockUserService.findUserByToken).toHaveBeenCalledWith(
        refreshtoken,
      );
    });

    it('should throw BadRequestException if findUserById fails', async () => {
      const boardId = 'valid-board-id';
      const dto: ListDto = { title: 'New List' };
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = { id: boardId, title: '', userId: '' };
      const mockUser = { id: 'user-id', username: '', email: '', password: '' };

      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockListService.findListByTitleAndBoard.mockResolvedValueOnce(null);
      mockListService.createList.mockResolvedValueOnce({});
      mockUserService.findUserByToken.mockResolvedValueOnce({
        userId: mockUser.id,
      });
      mockUserService.findUserById.mockResolvedValueOnce(null);

      await expect(
        controller.createList(boardId, dto, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.findListByTitleAndBoard).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
      expect(mockListService.createList).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
      expect(mockUserService.findUserByToken).toHaveBeenCalledWith(
        refreshtoken,
      );
      expect(mockUserService.findUserById).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('editListById', () => {
    it('should edit a list and return activity', async () => {
      const boardId = 'valid-board-id';
      const listId = 'valid-list-id';
      const dto: ListDto = { title: 'Edited List' };
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = { id: boardId, title: '', userId: '' };
      const mockList = {
        id: listId,
        title: 'Original List',
        boardId: boardId,
        createdAt: new Date(),
      };
      const mockEditedList = {
        id: listId,
        title: dto.title,
        boardId: boardId,
        createdAt: new Date(),
      };
      const mockUser = { id: 'user-id', username: '', email: '', password: '' };
      const mockActivity = {
        id: '',
        userId: mockUser.id,
        boardId,
        description: '',
        type: ActivityType.EDIT_LIST,
        createdAt: new Date(),
      };

      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockListService.findListById.mockResolvedValueOnce(mockList);
      mockListService.findListByTitleAndBoard.mockResolvedValueOnce(null);
      mockListService.editListById.mockResolvedValueOnce(mockEditedList);
      mockUserService.findUserByToken.mockResolvedValueOnce({
        userId: mockUser.id,
      });
      mockUserService.findUserById.mockResolvedValueOnce(mockUser);
      mockActivityService.createActivity.mockResolvedValueOnce(mockActivity);

      const result = await controller.editListById(
        boardId,
        listId,
        dto,
        refreshtoken,
      );

      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.findListById).toHaveBeenCalledWith(listId);
      expect(mockListService.findListByTitleAndBoard).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
      expect(mockListService.editListById).toHaveBeenCalledWith(
        listId,
        dto.title,
      );
      expect(mockUserService.findUserByToken).toHaveBeenCalledWith(
        refreshtoken,
      );
      expect(mockUserService.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(mockActivityService.createActivity).toHaveBeenCalledWith(
        mockUser.id,
        boardId,
        expect.stringContaining(
          `change title list 'Original List' on '${dto.title}'`,
        ),
        ActivityType.EDIT_LIST,
      );
      expect(result).toEqual(mockActivity);
    });

    it('should throw BadRequestException if board does not exist', async () => {
      const boardId = 'invalid-board-id';
      const listId = 'valid-list-id';
      const dto: ListDto = { title: 'Edited List' };
      const refreshtoken = 'valid-refresh-token';

      mockBoardService.findBoardById.mockResolvedValueOnce(null);

      await expect(
        controller.editListById(boardId, listId, dto, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
    });

    it('should throw BadRequestException if list does not exist', async () => {
      const boardId = 'valid-board-id';
      const listId = 'invalid-list-id';
      const dto: ListDto = { title: 'Edited List' };
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = { id: boardId, title: '', userId: '' };

      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockListService.findListById.mockResolvedValueOnce(null);

      await expect(
        controller.editListById(boardId, listId, dto, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.findListById).toHaveBeenCalledWith(listId);
    });

    it('should throw BadRequestException if list with title already exists', async () => {
      const boardId = 'valid-board-id';
      const listId = 'valid-list-id';
      const dto: ListDto = { title: 'Existing List' };
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = { id: boardId, title: '', userId: '' };
      const mockList = {
        id: listId,
        title: 'Existing List',
        boardId: boardId,
        createdAt: new Date(),
      };

      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockListService.findListById.mockResolvedValueOnce(mockList);
      mockListService.findListByTitleAndBoard.mockResolvedValueOnce(mockList);

      await expect(
        controller.editListById(boardId, listId, dto, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.findListById).toHaveBeenCalledWith(listId);
      expect(mockListService.findListByTitleAndBoard).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
    });

    it('should throw BadRequestException if editListById fails', async () => {
      const boardId = 'valid-board-id';
      const listId = 'valid-list-id';
      const dto: ListDto = { title: 'Edited List' };
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = { id: boardId, title: '', userId: '' };
      const mockList = {
        id: listId,
        title: 'Original List',
        boardId: boardId,
        createdAt: new Date(),
      };

      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockListService.findListById.mockResolvedValueOnce(mockList);
      mockListService.findListByTitleAndBoard.mockResolvedValueOnce(null);
      mockListService.editListById.mockResolvedValueOnce(null);

      await expect(
        controller.editListById(boardId, listId, dto, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.findListById).toHaveBeenCalledWith(listId);
      expect(mockListService.findListByTitleAndBoard).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
      expect(mockListService.editListById).toHaveBeenCalledWith(
        listId,
        dto.title,
      );
    });

    it('should throw BadRequestException if findUserByToken fails', async () => {
      const boardId = 'valid-board-id';
      const listId = 'valid-list-id';
      const dto: ListDto = { title: 'Edited List' };
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = { id: boardId, title: '', userId: '' };
      const mockList = {
        id: listId,
        title: 'Original List',
        boardId: boardId,
        createdAt: new Date(),
      };

      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockListService.findListById.mockResolvedValueOnce(mockList);
      mockListService.findListByTitleAndBoard.mockResolvedValueOnce(null);
      mockListService.editListById.mockResolvedValueOnce(mockList);
      mockUserService.findUserByToken.mockResolvedValueOnce(null);

      await expect(
        controller.editListById(boardId, listId, dto, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.findListById).toHaveBeenCalledWith(listId);
      expect(mockListService.findListByTitleAndBoard).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
      expect(mockListService.editListById).toHaveBeenCalledWith(
        listId,
        dto.title,
      );
      expect(mockUserService.findUserByToken).toHaveBeenCalledWith(
        refreshtoken,
      );
    });

    it('should throw BadRequestException if findUserById fails', async () => {
      const boardId = 'valid-board-id';
      const listId = 'valid-list-id';
      const dto: ListDto = { title: 'Edited List' };
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = { id: boardId, title: '', userId: '' };
      const mockList = {
        id: listId,
        title: 'Original List',
        boardId: boardId,
        createdAt: new Date(),
      };
      const mockUser = { id: 'user-id', username: '', email: '', password: '' };

      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockListService.findListById.mockResolvedValueOnce(mockList);
      mockListService.findListByTitleAndBoard.mockResolvedValueOnce(null);
      mockListService.editListById.mockResolvedValueOnce(mockList);
      mockUserService.findUserByToken.mockResolvedValueOnce({
        userId: mockUser.id,
      });
      mockUserService.findUserById.mockResolvedValueOnce(null);

      await expect(
        controller.editListById(boardId, listId, dto, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.findListById).toHaveBeenCalledWith(listId);
      expect(mockListService.findListByTitleAndBoard).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
      expect(mockListService.editListById).toHaveBeenCalledWith(
        listId,
        dto.title,
      );
      expect(mockUserService.findUserByToken).toHaveBeenCalledWith(
        refreshtoken,
      );
      expect(mockUserService.findUserById).toHaveBeenCalledWith(mockUser.id);
    });
  });
  describe('deleteList', () => {
    it('should create activity and return result if everything is valid', async () => {
      const boardId = 'valid-board-id';
      const listId = 'valid-list-id';
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = {
        id: 'valid-board-id',
        title: 'Board Title',
        userId: 'user-id',
      };
      const mockList = {
        id: 'valid-list-id',
        title: 'List Title',
        boardId: 'valid-board-id',
        createdAt: new Date(),
      };
      const mockUser = {
        id: 'user-id',
        username: 'username',
        email: 'user@example.com',
        password: 'password',
      };
      const mockActivity = {
        id: 'activity-id',
        userId: 'user-id',
        boardId: 'valid-board-id',
        description: `user@example.com delete list 'List Title'`,
        type: ActivityType.DELETE_LIST,
        createdAt: new Date(),
      };

      jest
        .spyOn(mockBoardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);
      jest
        .spyOn(mockListService, 'findListById')
        .mockResolvedValueOnce(mockList);
      jest.spyOn(mockListService, 'deleteList').mockResolvedValueOnce(true);

      jest.spyOn(mockUserService, 'findUserByToken').mockResolvedValueOnce({
        userId: 'user-id',
      });

      jest
        .spyOn(mockUserService, 'findUserById')
        .mockResolvedValueOnce(mockUser);
      jest
        .spyOn(mockActivityService, 'createActivity')
        .mockResolvedValueOnce(mockActivity);

      const result = await controller.deleteList(boardId, listId, refreshtoken);

      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.findListById).toHaveBeenCalledWith(listId);
      expect(mockListService.deleteList).toHaveBeenCalledWith(listId);

      expect(mockUserService.findUserByToken).toHaveBeenCalledWith(
        refreshtoken,
      );

      expect(mockUserService.findUserById).toHaveBeenCalledWith('user-id');
      expect(mockActivityService.createActivity).toHaveBeenCalledWith(
        'user-id',
        boardId,
        `user@example.com delete list 'List Title'`,
        ActivityType.DELETE_LIST,
      );
      expect(result).toEqual(mockActivity);
    });
    it('should throw BadRequestException if board does not exist', async () => {
      const boardId = 'invalid-board-id';
      const listId = 'valid-list-id';
      const refreshtoken = 'valid-refresh-token';

      jest.spyOn(mockBoardService, 'findBoardById').mockResolvedValueOnce(null);

      await expect(
        controller.deleteList(boardId, listId, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if list does not exist', async () => {
      const boardId = 'valid-board-id';
      const listId = 'invalid-list-id';
      const refreshtoken = 'valid-refresh-token';

      jest.spyOn(mockBoardService, 'findBoardById').mockResolvedValueOnce({});
      jest.spyOn(mockListService, 'findListById').mockResolvedValueOnce(null);

      await expect(
        controller.deleteList(boardId, listId, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if unable to delete list', async () => {
      const boardId = 'valid-board-id';
      const listId = 'valid-list-id';
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = {
        id: 'valid-board-id',
        title: 'Board Title',
        userId: 'user-id',
      };
      const mockList = {
        id: 'valid-list-id',
        title: 'List Title',
        boardId: 'valid-board-id',
        createdAt: new Date(),
      };

      jest
        .spyOn(mockBoardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);
      jest
        .spyOn(mockListService, 'findListById')
        .mockResolvedValueOnce(mockList);
      jest.spyOn(mockListService, 'deleteList').mockResolvedValueOnce(false);

      await expect(
        controller.deleteList(boardId, listId, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if user by token is not found', async () => {
      const boardId = 'valid-board-id';
      const listId = 'valid-list-id';
      const refreshtoken = 'invalid-refresh-token';

      const mockBoard = {
        id: 'valid-board-id',
        title: 'Board Title',
        userId: 'user-id',
      };
      const mockList = {
        id: 'valid-list-id',
        title: 'List Title',
        boardId: 'valid-board-id',
        createdAt: new Date(),
      };

      jest
        .spyOn(mockBoardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);
      jest
        .spyOn(mockListService, 'findListById')
        .mockResolvedValueOnce(mockList);
      jest
        .spyOn(mockUserService, 'findUserByToken')
        .mockResolvedValueOnce(null);

      await expect(
        controller.deleteList(boardId, listId, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if user is not found by id', async () => {
      const boardId = 'valid-board-id';
      const listId = 'valid-list-id';
      const refreshtoken = 'valid-refresh-token';

      const mockBoard = {
        id: 'valid-board-id',
        title: 'Board Title',
        userId: 'user-id',
      };
      const mockList = {
        id: 'valid-list-id',
        title: 'List Title',
        boardId: 'valid-board-id',
        createdAt: new Date(),
      };

      jest
        .spyOn(mockBoardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);
      jest
        .spyOn(mockListService, 'findListById')
        .mockResolvedValueOnce(mockList);
      jest.spyOn(mockUserService, 'findUserByToken').mockResolvedValueOnce({
        userId: 'user-id',
      });
      jest.spyOn(mockUserService, 'findUserById').mockResolvedValueOnce(null);

      await expect(
        controller.deleteList(boardId, listId, refreshtoken),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('getAllLists', () => {
    it('should throw BadRequestException if board does not exist', async () => {
      const boardId = 'non-existent-board-id';

      jest.spyOn(mockBoardService, 'findBoardById').mockResolvedValueOnce(null);

      await expect(controller.getAllLists(boardId)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should return lists if board exists', async () => {
      const boardId = 'valid-board-id';
      const mockBoard = {
        id: 'valid-board-id',
        title: 'Board Title',
        userId: 'user-id',
      };
      const mockLists = [
        {
          id: 'list-id-1',
          title: 'List 1',
          boardId: 'valid-board-id',
          createdAt: new Date(),
        },
        {
          id: 'list-id-2',
          title: 'List 2',
          boardId: 'valid-board-id',
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(mockBoardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);

      jest
        .spyOn(mockListService, 'getAllLists')
        .mockResolvedValueOnce(mockLists);

      const result = await controller.getAllLists(boardId);

      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockListService.getAllLists).toHaveBeenCalledWith(boardId);
      expect(result).toEqual(mockLists);
    });
  });
});
