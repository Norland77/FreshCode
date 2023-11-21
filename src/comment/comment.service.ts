import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(cardId: string, text: string, userId: string) {
    return this.commentRepository.createComment(cardId, text, userId);
  }
}
