import { Injectable } from '@nestjs/common';
import { BoardRepository } from './board.repository';

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async findBoardByTitle(title: string) {
    return this.boardRepository.findBoardByTitle(title);
  }

  createBoard(title: string, userId: string) {
    return this.boardRepository.createBoard(title, userId);
  }

  async findBoardById(id: string) {
    return this.boardRepository.findBoardById(id);
  }

  deleteBoardById(id: string) {
    return this.boardRepository.deleteBoardById(id);
  }

  updateBoardById(id: string, title: string) {
    return this.boardRepository.updateBoardById(id, title);
  }

  getAllBoard() {
    return this.boardRepository.getAllBoard()
  }
}
