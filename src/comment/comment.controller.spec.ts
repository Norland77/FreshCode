import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { BoardService } from '../board/board.service';
import { CardService } from '../card/card.service';
import { UserService } from '../user/user.service';
import { ActivityService } from '../activity/activity.service';
import { CommentDto } from './dto/comment.dto';
import { ActivityType } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

const mockCommentService = {
  createComment: jest.fn(),
};

const mockBoardService = {
  findBoardById: jest.fn(),
};

const mockCardService = {
  findCardById: jest.fn(),
};

const mockUserService = {
  findUserByToken: jest.fn(),
  findUserById: jest.fn(),
};

const mockActivityService = {
  createActivity: jest.fn(),
};

describe('CommentController', () => {
  let controller: CommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        { provide: CommentService, useValue: mockCommentService },
        { provide: BoardService, useValue: mockBoardService },
        { provide: CardService, useValue: mockCardService },
        { provide: UserService, useValue: mockUserService },
        { provide: ActivityService, useValue: mockActivityService },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createComment', () => {
    it('should create a comment and return activity', async () => {
      const boardId = 'valid-board-id';
      const cardId = 'valid-card-id';
      const refreshtoken = 'valid-refresh-token';
      const commentDto: CommentDto = {
        text: 'New comment',
      };

      const mockCard = {
        title: 'Card Title',
      };

      const mockBoard = {
        id: boardId,
      };

      const mockUser = {
        id: 'user-id',
        email: 'user@example.com',
      };

      const mockCreatedComment = {
        id: 'comment-id',
      };

      const mockActivity = {
        id: 'activity-id',
      };

      mockCardService.findCardById.mockResolvedValueOnce(mockCard);
      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockUserService.findUserByToken.mockResolvedValueOnce({
        userId: mockUser.id,
      });
      mockUserService.findUserById.mockResolvedValueOnce(mockUser);
      mockCommentService.createComment.mockResolvedValueOnce(
        mockCreatedComment,
      );
      mockActivityService.createActivity.mockResolvedValueOnce(mockActivity);

      const result = await controller.createComment(
        boardId,
        cardId,
        refreshtoken,
        commentDto,
      );

      expect(mockCardService.findCardById).toHaveBeenCalledWith(cardId);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockUserService.findUserByToken).toHaveBeenCalledWith(
        refreshtoken,
      );
      expect(mockUserService.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(mockCommentService.createComment).toHaveBeenCalledWith(
        cardId,
        commentDto.text,
        mockUser.id,
      );
      expect(mockActivityService.createActivity).toHaveBeenCalledWith(
        mockUser.id,
        boardId,
        expect.stringContaining(`add comment to card '${mockCard.title}'`),
        ActivityType.ADD_COMMENT,
      );
      expect(result).toEqual(mockActivity);
    });

    it('should throw BadRequestException if card or board is not found', async () => {
      const boardId = 'invalid-board-id';
      const cardId = 'invalid-card-id';
      const refreshtoken = 'valid-refresh-token';
      const commentDto: CommentDto = {
        text: 'New comment',
      };

      mockCardService.findCardById.mockResolvedValueOnce(null);
      mockBoardService.findBoardById.mockResolvedValueOnce(null);

      await expect(
        controller.createComment(boardId, cardId, refreshtoken, commentDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if user is not found', async () => {
      const boardId = 'valid-board-id';
      const cardId = 'valid-card-id';
      const refreshtoken = 'invalid-refresh-token';
      const commentDto: CommentDto = {
        text: 'New comment',
      };

      mockCardService.findCardById.mockResolvedValueOnce({});
      mockBoardService.findBoardById.mockResolvedValueOnce({});
      mockUserService.findUserByToken.mockResolvedValueOnce(null);

      await expect(
        controller.createComment(boardId, cardId, refreshtoken, commentDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if user by ID is not found', async () => {
      const boardId = 'valid-board-id';
      const cardId = 'valid-card-id';
      const refreshtoken = 'valid-refresh-token';
      const commentDto: CommentDto = {
        text: 'New comment',
      };

      mockCardService.findCardById.mockResolvedValueOnce({});
      mockBoardService.findBoardById.mockResolvedValueOnce({});
      mockUserService.findUserByToken.mockResolvedValueOnce({
        userId: 'invalid-user-id',
      });
      mockUserService.findUserById.mockResolvedValueOnce(null);

      await expect(
        controller.createComment(boardId, cardId, refreshtoken, commentDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if comment is not created', async () => {
      const boardId = 'valid-board-id';
      const cardId = 'valid-card-id';
      const refreshtoken = 'valid-refresh-token';
      const commentDto: CommentDto = {
        text: 'New comment',
      };

      mockCardService.findCardById.mockResolvedValueOnce({});
      mockBoardService.findBoardById.mockResolvedValueOnce({});
      mockUserService.findUserByToken.mockResolvedValueOnce({
        userId: 'user-id',
      });
      mockUserService.findUserById.mockResolvedValueOnce({});
      mockCommentService.createComment.mockResolvedValueOnce(null);

      await expect(
        controller.createComment(boardId, cardId, refreshtoken, commentDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if activity is not created', async () => {
      const boardId = 'valid-board-id';
      const cardId = 'valid-card-id';
      const refreshtoken = 'valid-refresh-token';
      const commentDto: CommentDto = {
        text: 'New comment',
      };

      const mockCard = {
        title: 'Card Title',
      };

      const mockBoard = {
        id: boardId,
      };

      const mockUser = {
        id: 'user-id',
        email: 'user@example.com',
      };

      mockCardService.findCardById.mockResolvedValueOnce(mockCard);
      mockBoardService.findBoardById.mockResolvedValueOnce(mockBoard);
      mockUserService.findUserByToken.mockResolvedValueOnce({
        userId: mockUser.id,
      });
      mockUserService.findUserById.mockResolvedValueOnce(mockUser);
      mockCommentService.createComment.mockResolvedValueOnce({});
      mockActivityService.createActivity.mockResolvedValueOnce(null);

      await expect(
        controller.createComment(boardId, cardId, refreshtoken, commentDto),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
