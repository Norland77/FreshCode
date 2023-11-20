import { Injectable } from '@nestjs/common';
import { ListRepository } from './list.repository';

@Injectable()
export class ListService {
  constructor(private readonly listRepository: ListRepository) {}

  async findListByTitleAndBoard(boardId: string, title: string) {
    return this.listRepository.findListByTitleAndBoard(boardId, title);
  }

  async createList(boardId: string, title: string) {
    return this.listRepository.createList(boardId, title);
  }

  async editListById(listId: string, title: string) {
    return this.listRepository.editListById(listId, title);
  }

  async findListById(id: string) {
    return this.listRepository.findListById(id);
  }

  async deleteList(id: string) {
    return this.listRepository.deleteList(id);
  }

  getAllLists(boardId: string) {
    return this.listRepository.getAllLists(boardId);
  }
}
