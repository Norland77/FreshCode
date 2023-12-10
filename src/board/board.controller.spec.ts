import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { UserService } from '../user/user.service';
import { BoardDto } from './dto/board.dto';
import { BadRequestException } from '@nestjs/common';

describe('BoardController', () => {
  let controller: BoardController;
  let boardService: BoardService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [
        {
          provide: BoardService,
          useValue: {
            createBoard: jest.fn(),
            deleteBoardById: jest.fn(),
            updateBoardById: jest.fn(),
            getAllBoard: jest.fn(),
            findBoardById: jest.fn(),
            findBoardByTitle: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserByToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BoardController>(BoardController);
    boardService = module.get<BoardService>(BoardService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBoard', () => {
    it('should create a board', async () => {
      const dto: BoardDto = { title: 'Test Board' };
      const refreshtoken = 'valid-refresh-token';
      const mockUser = { userId: 'user-id' };

      jest
        .spyOn(userService, 'findUserByToken')
        .mockResolvedValueOnce(mockUser);
      jest.spyOn(boardService, 'findBoardByTitle').mockResolvedValueOnce(null);
      jest.spyOn(boardService, 'createBoard').mockResolvedValueOnce({
        id: '',
        title: '',
        userId: '',
      });

      const result = await controller.createBoard(dto, refreshtoken);

      expect(userService.findUserByToken).toHaveBeenCalledWith(refreshtoken);
      expect(boardService.findBoardByTitle).toHaveBeenCalledWith(dto.title);
      expect(boardService.createBoard).toHaveBeenCalledWith(
        dto.title,
        mockUser.userId,
      );
      expect(result).toEqual({
        id: '',
        title: '',
        userId: '',
      });
    });

    it('should throw BadRequestException if user is not found', async () => {
      const dto: BoardDto = { title: 'Test Board' };
      const refreshtoken = 'invalid-refresh-token';

      jest.spyOn(userService, 'findUserByToken').mockResolvedValueOnce(null);

      await expect(controller.createBoard(dto, refreshtoken)).rejects.toThrow(
        BadRequestException,
      );
      expect(userService.findUserByToken).toHaveBeenCalledWith(refreshtoken);
      expect(boardService.findBoardByTitle).not.toHaveBeenCalled();
      expect(boardService.createBoard).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if board with the same title already exists', async () => {
      const dto: BoardDto = { title: 'Existing Board' };
      const refreshtoken = 'valid-refresh-token';
      const mockUser = { userId: 'user-id' };

      jest
        .spyOn(userService, 'findUserByToken')
        .mockResolvedValueOnce(mockUser);
      jest.spyOn(boardService, 'findBoardByTitle').mockResolvedValueOnce({
        id: '',
        title: '',
        userId: '',
      });

      await expect(controller.createBoard(dto, refreshtoken)).rejects.toThrow(
        BadRequestException,
      );
      expect(userService.findUserByToken).toHaveBeenCalledWith(refreshtoken);
      expect(boardService.findBoardByTitle).toHaveBeenCalledWith(dto.title);
      expect(boardService.createBoard).not.toHaveBeenCalled();
    });
  });

  describe('deleteBoardById', () => {
    it('should delete a board by ID', async () => {
      const boardId = 'valid-board-id';

      jest.spyOn(boardService, 'findBoardById').mockResolvedValueOnce({
        id: '',
        title: '',
        userId: '',
      });
      jest.spyOn(boardService, 'deleteBoardById').mockResolvedValueOnce({
        id: '',
        title: '',
        userId: '',
      });

      const result = await controller.deleteBoardById(boardId);

      expect(boardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(boardService.deleteBoardById).toHaveBeenCalledWith(boardId);
      expect(result).toEqual({
        id: '',
        title: '',
        userId: '',
      });
    });

    it('should throw BadRequestException if board is not found by ID', async () => {
      const boardId = 'invalid-board-id';

      jest.spyOn(boardService, 'findBoardById').mockResolvedValueOnce(null);

      await expect(controller.deleteBoardById(boardId)).rejects.toThrow(
        BadRequestException,
      );
      expect(boardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(boardService.deleteBoardById).not.toHaveBeenCalled();
    });
  });

  describe('updateBoardById', () => {
    it('should update a board by ID', async () => {
      const boardId = 'valid-board-id';
      const dto: BoardDto = { title: 'Updated Board' };

      jest.spyOn(boardService, 'findBoardById').mockResolvedValueOnce({
        id: '',
        title: '',
        userId: '',
      });
      jest.spyOn(boardService, 'updateBoardById').mockResolvedValueOnce({
        id: '',
        title: '',
        userId: '',
      });

      const result = await controller.updateBoardById(boardId, dto);

      expect(boardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(boardService.updateBoardById).toHaveBeenCalledWith(
        boardId,
        dto.title,
      );
      expect(result).toEqual({
        id: '',
        title: '',
        userId: '',
      });
    });

    it('should throw BadRequestException if board is not found by ID', async () => {
      const boardId = 'invalid-board-id';
      const dto: BoardDto = { title: 'Updated Board' };

      jest.spyOn(boardService, 'findBoardById').mockResolvedValueOnce(null);

      await expect(controller.updateBoardById(boardId, dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(boardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(boardService.updateBoardById).not.toHaveBeenCalled();
    });
  });

  describe('getAllBoard', () => {
    it('should get all boards', async () => {
      const mockBoards = [
        {
          id: '',
          title: '',
          userId: '',
        },
      ];

      jest.spyOn(boardService, 'getAllBoard').mockResolvedValueOnce(mockBoards);

      const result = await controller.getAllBoard();

      expect(boardService.getAllBoard).toHaveBeenCalled();
      expect(result).toEqual(mockBoards);
    });
  });

  describe('getBoardById', () => {
    it('should get a board by ID', async () => {
      const boardId = 'valid-board-id';
      const mockBoard = {
        id: 'mock-id',
        title: 'Mock Board',
        userId: 'user-id',
      };

      jest
        .spyOn(boardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);

      const result = await controller.getBoardById(boardId);
      expect(boardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(result).toEqual(mockBoard);
    });

    it('should throw BadRequestException if board is not found by ID', async () => {
      const boardId = 'invalid-board-id';

      jest.spyOn(boardService, 'findBoardById').mockResolvedValueOnce(null);

      await expect(controller.getBoardById(boardId)).rejects.toThrow(
        BadRequestException,
      );
      expect(boardService.findBoardById).toHaveBeenCalledWith(boardId);
    });
  });
});
