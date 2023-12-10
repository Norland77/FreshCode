import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { BoardRepository } from './board.repository';

describe('BoardService', () => {
  let service: BoardService;
  let boardRepository: BoardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: BoardRepository,
          useValue: {
            findBoardByTitle: jest.fn(),
            createBoard: jest.fn(),
            findBoardById: jest.fn(),
            deleteBoardById: jest.fn(),
            updateBoardById: jest.fn(),
            getAllBoard: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    boardRepository = module.get<BoardRepository>(BoardRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findBoardByTitle', () => {
    it('should find a board by title', async () => {
      const title = 'Test Board';
      const mockBoard = {
        id: '',
        title: '',
        userId: '',
      };

      jest
        .spyOn(boardRepository, 'findBoardByTitle')
        .mockResolvedValueOnce(mockBoard);

      const result = await service.findBoardByTitle(title);

      expect(boardRepository.findBoardByTitle).toHaveBeenCalledWith(title);
      expect(result).toEqual(mockBoard);
    });
  });

  describe('createBoard', () => {
    it('should create a board', async () => {
      const title = 'Test Board';
      const userId = 'user-id';
      const mockCreatedBoard = {
        id: '',
        title: '',
        userId: '',
      };

      jest
        .spyOn(boardRepository, 'createBoard')
        .mockResolvedValueOnce(mockCreatedBoard);

      const result = await service.createBoard(title, userId);

      expect(boardRepository.createBoard).toHaveBeenCalledWith(title, userId);
      expect(result).toEqual(mockCreatedBoard);
    });
  });

  describe('findBoardById', () => {
    it('should find a board by ID', async () => {
      const boardId = 'valid-board-id';
      const mockBoard = {
        id: '',
        title: '',
        userId: '',
      };

      jest
        .spyOn(boardRepository, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);

      const result = await service.findBoardById(boardId);

      expect(boardRepository.findBoardById).toHaveBeenCalledWith(boardId);
      expect(result).toEqual(mockBoard);
    });
  });

  describe('deleteBoardById', () => {
    it('should delete a board by ID', async () => {
      const boardId = 'valid-board-id';
      const mockDeletedBoard = {
        id: '',
        title: '',
        userId: '',
      };

      jest
        .spyOn(boardRepository, 'deleteBoardById')
        .mockResolvedValueOnce(mockDeletedBoard);

      const result = await service.deleteBoardById(boardId);

      expect(boardRepository.deleteBoardById).toHaveBeenCalledWith(boardId);
      expect(result).toEqual(mockDeletedBoard);
    });
  });

  describe('updateBoardById', () => {
    it('should update a board by ID', async () => {
      const boardId = 'valid-board-id';
      const title = 'Updated Board';
      const mockUpdatedBoard = {
        id: '',
        title: '',
        userId: '',
      };

      jest
        .spyOn(boardRepository, 'updateBoardById')
        .mockResolvedValueOnce(mockUpdatedBoard);

      const result = await service.updateBoardById(boardId, title);

      expect(boardRepository.updateBoardById).toHaveBeenCalledWith(
        boardId,
        title,
      );
      expect(result).toEqual(mockUpdatedBoard);
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

      jest
        .spyOn(boardRepository, 'getAllBoard')
        .mockResolvedValueOnce(mockBoards);

      const result = await service.getAllBoard();

      expect(boardRepository.getAllBoard).toHaveBeenCalled();
      expect(result).toEqual(mockBoards);
    });
  });
});
