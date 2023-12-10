import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { ListService } from '../list/list.service';
import { ActivityService } from '../activity/activity.service';
import { BoardService } from '../board/board.service';
import { UserService } from '../user/user.service';
import { ActivityType } from '@prisma/client';
import { CardCreateDto } from './dto/card-create.dto';
import { CardUpdateDto } from './dto/card-update.dto';
import { BadRequestException } from '@nestjs/common';
import { CardRepository } from './card.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ListRepository } from '../list/list.repository';
import { ActivityRepository } from '../activity/activity.repository';
import { BoardRepository } from '../board/board.repository';
import { UserRepository } from '../user/user.repository';

describe('CardController', () => {
  let controller: CardController;
  let cardService: CardService;
  let listService: ListService;
  let activityService: ActivityService;
  let boardService: BoardService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        CardService,
        CardRepository,
        ListService,
        ListRepository,
        ActivityService,
        ActivityRepository,
        BoardService,
        BoardRepository,
        UserService,
        UserRepository,
        PrismaService,
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
    cardService = module.get<CardService>(CardService);
    listService = module.get<ListService>(ListService);
    activityService = module.get<ActivityService>(ActivityService);
    boardService = module.get<BoardService>(BoardService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCard', () => {
    it('should create a card and return activity', async () => {
      const boardId = 'valid-board-id';
      const listId = 'valid-list-id';
      const dto: CardCreateDto = { title: 'New Card' };
      const refreshtoken = 'valid-refresh-token';
      const mockBoard = {
        id: '',
        title: '',
        userId: '',
      };
      const mockList = {
        id: '',
        title: '',
        boardId: '',
        createdAt: new Date(),
      };
      const mockCreatedCard = {
        id: '',
        title: '',
        description: '',
        listId: '',
      };
      const mockUser = {
        id: '',
        username: '',
        email: '',
        password: '',
      };
      const mockActivity = {
        id: '',
        userId: '',
        boardId: '',
        description: '',
        type: ActivityType.ADD_COMMENT,
        createdAt: new Date(),
      };

      jest
        .spyOn(boardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);
      jest.spyOn(listService, 'findListById').mockResolvedValueOnce(mockList);
      jest
        .spyOn(cardService, 'createCard')
        .mockResolvedValueOnce(mockCreatedCard);
      jest
        .spyOn(userService, 'findUserByToken')
        .mockResolvedValueOnce({ userId: mockUser.id });
      jest.spyOn(userService, 'findUserById').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(activityService, 'createActivity')
        .mockResolvedValueOnce(mockActivity);

      const result = await controller.createCard(
        boardId,
        listId,
        dto,
        refreshtoken,
      );

      expect(boardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(listService.findListById).toHaveBeenCalledWith(listId);
      expect(cardService.createCard).toHaveBeenCalledWith(dto.title, listId);
      expect(userService.findUserByToken).toHaveBeenCalledWith(refreshtoken);
      expect(userService.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(activityService.createActivity).toHaveBeenCalledWith(
        mockUser.id,
        boardId,
        expect.stringContaining(`add card '${dto.title}' in list`),
        ActivityType.ADD_CARD,
      );
      expect(result).toEqual(mockActivity);
    });

    it('should throw BadRequestException if board or list not found', async () => {
      const boardId = 'non-existent-board-id';
      const listId = 'non-existent-list-id';
      const dto: CardCreateDto = { title: 'New Card' };
      const refreshtoken = 'valid-refresh-token';

      jest.spyOn(boardService, 'findBoardById').mockResolvedValueOnce(null);
      jest.spyOn(listService, 'findListById').mockResolvedValueOnce(null);

      await expect(
        controller.createCard(boardId, listId, dto, refreshtoken),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateCard', () => {
    it('should update a card and return activity', async () => {
      const boardId = 'valid-board-id';
      const cardId = 'valid-card-id';
      const dto: CardUpdateDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };
      const refreshtoken = 'valid-refresh-token';
      const mockCard = {
        comments: [
          {
            user: {
              id: '',
              username: '',
              email: '',
            },
            id: '',
            text: '',
            createdAt: new Date(),
            userId: '',
            cardId: '',
          },
        ],
        id: '',
        title: '',
        description: '',
        listId: '',
      };
      const mockBoard = {
        id: '',
        title: '',
        userId: '',
      };
      const mockUpdatedCard = {
        comments: [
          {
            user: {
              id: '',
              username: '',
              email: '',
            },
            id: '',
            text: '',
            createdAt: new Date(),
            userId: '',
            cardId: '',
          },
        ],
        id: '',
        title: '',
        description: '',
        listId: '',
      };
      const mockUser = {
        id: '',
        username: '',
        email: '',
        password: '',
      };
      const mockActivity = {
        id: '',
        userId: '',
        boardId: '',
        description: '',
        type: ActivityType.ADD_COMMENT,
        createdAt: new Date(),
      };

      jest.spyOn(cardService, 'findCardById').mockResolvedValueOnce(mockCard);
      jest
        .spyOn(boardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);
      jest
        .spyOn(cardService, 'updateCard')
        .mockResolvedValueOnce(mockUpdatedCard);
      jest
        .spyOn(userService, 'findUserByToken')
        .mockResolvedValueOnce({ userId: mockUser.id });
      jest.spyOn(userService, 'findUserById').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(activityService, 'createActivity')
        .mockResolvedValueOnce(mockActivity);

      const result = await controller.updateCard(
        boardId,
        cardId,
        dto,
        refreshtoken,
      );

      expect(cardService.findCardById).toHaveBeenCalledWith(cardId);
      expect(boardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(cardService.updateCard).toHaveBeenCalledWith(
        cardId,
        dto.title,
        dto.description,
      );
      expect(userService.findUserByToken).toHaveBeenCalledWith(refreshtoken);
      expect(userService.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(activityService.createActivity).toHaveBeenCalledWith(
        mockUser.id,
        boardId,
        expect.stringContaining(`edit card '${dto.title}'`),
        ActivityType.EDIT_CARD,
      );
      expect(result).toEqual(mockActivity);
    });

    it('should throw BadRequestException if card or board not found', async () => {
      const boardId = 'non-existent-board-id';
      const cardId = 'non-existent-card-id';
      const dto: CardUpdateDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };
      const refreshtoken = 'valid-refresh-token';

      jest.spyOn(cardService, 'findCardById').mockResolvedValueOnce(null);
      jest.spyOn(boardService, 'findBoardById').mockResolvedValueOnce(null);

      await expect(
        controller.updateCard(boardId, cardId, dto, refreshtoken),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if userByToken or user not found', async () => {
      const boardId = 'valid-board-id';
      const cardId = 'valid-card-id';
      const dto: CardUpdateDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };
      const refreshtoken = 'invalid-refresh-token';
      const mockCard = {
        comments: [
          {
            user: {
              id: '',
              username: '',
              email: '',
            },
            id: '',
            text: '',
            createdAt: new Date(),
            userId: '',
            cardId: '',
          },
        ],
        id: '',
        title: '',
        description: '',
        listId: '',
      };
      const mockBoard = {
        id: '',
        title: '',
        userId: '',
      };
      const mockUpdatedCard = {
        comments: [
          {
            user: {
              id: '',
              username: '',
              email: '',
            },
            id: '',
            text: '',
            createdAt: new Date(),
            userId: '',
            cardId: '',
          },
        ],
        id: '',
        title: '',
        description: '',
        listId: '',
      };

      jest.spyOn(cardService, 'findCardById').mockResolvedValueOnce(mockCard);
      jest
        .spyOn(boardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);
      jest
        .spyOn(cardService, 'updateCard')
        .mockResolvedValueOnce(mockUpdatedCard);
      jest.spyOn(userService, 'findUserByToken').mockResolvedValueOnce(null);

      await expect(
        controller.updateCard(boardId, cardId, dto, refreshtoken),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('moveCard', () => {
    it('should move a card and return activity', async () => {
      const boardId = 'valid-board-id';
      const cardId = 'valid-card-id';
      const listId = 'valid-list-id';
      const refreshtoken = 'valid-refresh-token';
      const mockCard = {
        comments: [
          {
            user: {
              id: '',
              username: '',
              email: '',
            },
            id: '',
            text: '',
            createdAt: new Date(),
            userId: '',
            cardId: '',
          },
        ],
        id: '',
        title: '',
        description: '',
        listId: '',
      };
      const mockBoard = {
        id: '',
        title: '',
        userId: '',
      };
      const mockList = {
        id: 'valid-list-id', // Ensure this ID is valid
        title: '',
        boardId: '',
        createdAt: new Date(),
      };
      const mockMovedCard = {
        comments: [
          {
            user: {
              id: '',
              username: '',
              email: '',
            },
            id: '',
            text: '',
            createdAt: new Date(),
            userId: '',
            cardId: '',
          },
        ],
        id: '',
        title: '',
        description: '',
        listId: '',
      };
      const mockUser = {
        id: '',
        username: '',
        email: '',
        password: '',
      };
      const mockActivity = {
        id: '',
        userId: '',
        boardId: '',
        description: '',
        type: ActivityType.ADD_COMMENT,
        createdAt: new Date(),
      };

      jest.spyOn(cardService, 'findCardById').mockResolvedValueOnce(mockCard);
      jest
        .spyOn(boardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);
      jest.spyOn(listService, 'findListById').mockResolvedValueOnce(mockList);
      jest.spyOn(cardService, 'moveCard').mockResolvedValueOnce(mockMovedCard);
      jest
        .spyOn(userService, 'findUserByToken')
        .mockResolvedValueOnce({ userId: mockUser.id });
      jest.spyOn(userService, 'findUserById').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(activityService, 'createActivity')
        .mockResolvedValueOnce(mockActivity);

      const result = await controller.moveCard(
        boardId,
        cardId,
        listId,
        refreshtoken,
      );

      expect(cardService.findCardById).toHaveBeenCalledWith(cardId);
      expect(boardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(listService.findListById).toHaveBeenCalledWith(listId);
      expect(cardService.moveCard).toHaveBeenCalledWith(cardId, listId);
      expect(userService.findUserByToken).toHaveBeenCalledWith(refreshtoken);
      expect(userService.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(activityService.createActivity).toHaveBeenCalledWith(
        mockUser.id,
        boardId,
        expect.stringContaining(
          `move card '${mockCard.title}' in list '${mockList.title}'`,
        ),
        ActivityType.MOVE_CARD,
      );
      expect(result).toEqual(mockActivity);
    });

    it('should throw BadRequestException if card or board not found', async () => {
      const boardId = 'non-existent-board-id';
      const cardId = 'non-existent-card-id';
      const listId = 'valid-list-id';
      const refreshtoken = 'valid-refresh-token';

      jest.spyOn(cardService, 'findCardById').mockResolvedValueOnce(null);
      jest.spyOn(boardService, 'findBoardById').mockResolvedValueOnce(null);

      await expect(
        controller.moveCard(boardId, cardId, listId, refreshtoken),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if list not found or card is already in the target list', async () => {
      const boardId = 'valid-board-id';
      const cardId = 'valid-card-id';
      const listId = 'non-existent-list-id';
      const refreshtoken = 'valid-refresh-token';
      const mockCard = {
        comments: [
          {
            user: {
              id: '',
              username: '',
              email: '',
            },
            id: '',
            text: '',
            createdAt: new Date(),
            userId: '',
            cardId: '',
          },
        ],
        id: '',
        title: '',
        description: '',
        listId: '',
      };
      const mockBoard = {
        id: '',
        title: '',
        userId: '',
      };

      jest.spyOn(cardService, 'findCardById').mockResolvedValueOnce(mockCard);
      jest
        .spyOn(boardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);
      jest.spyOn(listService, 'findListById').mockResolvedValueOnce(null);

      await expect(
        controller.moveCard(boardId, cardId, listId, refreshtoken),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if userByToken or user not found', async () => {
      const boardId = 'valid-board-id';
      const cardId = 'valid-card-id';
      const listId = 'valid-list-id';
      const refreshtoken = 'invalid-refresh-token';
      const mockCard = {
        comments: [
          {
            user: {
              id: '',
              username: '',
              email: '',
            },
            id: '',
            text: '',
            createdAt: new Date(),
            userId: '',
            cardId: '',
          },
        ],
        id: '',
        title: '',
        description: '',
        listId: '',
      };
      const mockBoard = {
        id: '',
        title: '',
        userId: '',
      };
      const mockList = {
        id: '',
        title: '',
        boardId: '',
        createdAt: new Date(),
      };
      const mockMovedCard = {
        comments: [
          {
            user: {
              id: '',
              username: '',
              email: '',
            },
            id: '',
            text: '',
            createdAt: new Date(),
            userId: '',
            cardId: '',
          },
        ],
        id: '',
        title: '',
        description: '',
        listId: '',
      };

      jest.spyOn(cardService, 'findCardById').mockResolvedValueOnce(mockCard);
      jest
        .spyOn(boardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);
      jest.spyOn(listService, 'findListById').mockResolvedValueOnce(mockList);
      jest.spyOn(cardService, 'moveCard').mockResolvedValueOnce(mockMovedCard);
      jest.spyOn(userService, 'findUserByToken').mockResolvedValueOnce(null);

      await expect(
        controller.moveCard(boardId, cardId, listId, refreshtoken),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteCard', () => {
    it('should delete a card and return activity', async () => {
      const boardId = 'valid-board-id';
      const cardId = 'valid-card-id';
      const refreshtoken = 'valid-refresh-token';
      const mockCard = {
        comments: [
          {
            user: {
              id: '',
              username: '',
              email: '',
            },
            id: '',
            text: '',
            createdAt: new Date(),
            userId: '',
            cardId: '',
          },
        ],
        id: 'valid-card-id',
        title: 'Mock Card',
        description: 'Mock Card Description',
        listId: 'valid-list-id',
      };
      const mockBoard = {
        id: 'valid-board-id',
        title: 'Mock Board',
        userId: 'user-id',
      };
      const mockUser = {
        id: 'user-id',
        username: 'mockuser',
        email: 'mockuser@example.com',
        password: 'mockpassword',
      };
      const mockActivity = {
        id: 'mock-activity-id',
        userId: 'user-id',
        boardId: 'valid-board-id',
        description: `mockuser delete card 'Mock Card'`,
        type: ActivityType.DELETE_CARD,
        createdAt: new Date(),
      };

      jest.spyOn(cardService, 'findCardById').mockResolvedValueOnce(mockCard);
      jest
        .spyOn(boardService, 'findBoardById')
        .mockResolvedValueOnce(mockBoard);
      jest.spyOn(cardService, 'deleteCard').mockResolvedValueOnce(mockCard);
      jest
        .spyOn(userService, 'findUserByToken')
        .mockResolvedValueOnce({ userId: mockUser.id });
      jest.spyOn(userService, 'findUserById').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(activityService, 'createActivity')
        .mockResolvedValueOnce(mockActivity);

      const result = await controller.deleteCard(boardId, cardId, refreshtoken);

      expect(cardService.findCardById).toHaveBeenCalledWith(cardId);
      expect(boardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(cardService.deleteCard).toHaveBeenCalledWith(cardId);
      expect(userService.findUserByToken).toHaveBeenCalledWith(refreshtoken);
      expect(userService.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(activityService.createActivity).toHaveBeenCalledWith(
        mockUser.id,
        boardId,
        expect.stringContaining(`delete card 'Mock Card'`),
        ActivityType.DELETE_CARD,
      );
      expect(result).toEqual(mockActivity);
    });

    it('should throw BadRequestException if card does not exist', async () => {
      const boardId = 'valid-board-id';
      const cardId = 'non-existent-card-id';
      const refreshtoken = 'valid-refresh-token';

      jest.spyOn(cardService, 'findCardById').mockResolvedValueOnce(null);

      await expect(
        controller.deleteCard(boardId, cardId, refreshtoken),
      ).rejects.toThrow(BadRequestException);
      expect(cardService.findCardById).toHaveBeenCalledWith(cardId);
    });
  });

  describe('getCardById', () => {
    it('should get a card by ID', async () => {
      const cardId = 'valid-card-id';
      const mockCard = {
        comments: [
          {
            user: {
              id: '',
              username: '',
              email: '',
            },
            id: '',
            text: '',
            createdAt: new Date(),
            userId: '',
            cardId: '',
          },
        ],
        id: 'valid-card-id',
        title: 'Mock Card',
        description: 'Mock Card Description',
        listId: 'valid-list-id',
      };

      jest.spyOn(cardService, 'findCardById').mockResolvedValueOnce(mockCard);

      const result = await controller.getCardById(cardId);

      expect(cardService.findCardById).toHaveBeenCalledWith(cardId);
      expect(result).toEqual(mockCard);
    });

    it('should throw BadRequestException if card does not exist', async () => {
      const cardId = 'non-existent-card-id';

      jest.spyOn(cardService, 'findCardById').mockResolvedValueOnce(null);

      await expect(controller.getCardById(cardId)).rejects.toThrow(
        BadRequestException,
      );
      expect(cardService.findCardById).toHaveBeenCalledWith(cardId);
    });
  });
});
