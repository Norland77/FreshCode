import { Injectable } from '@nestjs/common';
import { CardRepository } from './card.repository';

@Injectable()
export class CardService {
  constructor(private readonly cardRepository: CardRepository) {}

  async createCard(title: string, listId: string) {
    return await this.cardRepository.createCard(title, listId);
  }

  async findCardById(id: string) {
    return this.cardRepository.findCardById(id);
  }

  async updateCard(
    id: string,
    title: string | undefined,
    description: string | undefined,
  ) {
    return this.cardRepository.updateCard(id, title, description);
  }

  async moveCard(id: string, listId: string) {
    return this.cardRepository.moveCard(id, listId);
  }

  async deleteCard(id: string) {
    return this.cardRepository.deleteCard(id);
  }
}
