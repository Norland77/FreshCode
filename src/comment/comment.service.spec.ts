import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';

const mockCommentRepository = {
  createComment: jest.fn(),
};

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const cardId = 'valid-card-id';
      const text = 'New comment';
      const userId = 'user-id';

      const mockCreatedComment = {
        id: 'comment-id',
        cardId,
        text,
        userId,
      };

      mockCommentRepository.createComment.mockResolvedValueOnce(
        mockCreatedComment,
      );

      const result = await service.createComment(cardId, text, userId);

      expect(mockCommentRepository.createComment).toHaveBeenCalledWith(
        cardId,
        text,
        userId,
      );
      expect(result).toEqual(mockCreatedComment);
    });
  });
});
