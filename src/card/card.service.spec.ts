import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { CardRepository } from './card.repository';

describe('CardService', () => {
  let service: CardService;
  let repository: CardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: CardRepository,
          useValue: {
            createCard: jest.fn(),
            findCardById: jest.fn(),
            updateCard: jest.fn(),
            moveCard: jest.fn(),
            deleteCard: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
    repository = module.get<CardRepository>(CardRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCard', () => {
    it('should create a card', async () => {
      const title = 'New Card';
      const listId = 'list-id';

      await service.createCard(title, listId);

      expect(repository.createCard).toHaveBeenCalledWith(title, listId);
    });
  });

  describe('findCardById', () => {
    it('should find a card by ID', async () => {
      const cardId = 'valid-card-id';

      await service.findCardById(cardId);

      expect(repository.findCardById).toHaveBeenCalledWith(cardId);
    });
  });

  describe('updateCard', () => {
    it('should update a card', async () => {
      const cardId = 'valid-card-id';
      const title = 'Updated Card';
      const description = 'Updated Description';

      await service.updateCard(cardId, title, description);

      expect(repository.updateCard).toHaveBeenCalledWith(
        cardId,
        title,
        description,
      );
    });
  });

  describe('moveCard', () => {
    it('should move a card to a new list', async () => {
      const cardId = 'valid-card-id';
      const listId = 'new-list-id';

      await service.moveCard(cardId, listId);

      expect(repository.moveCard).toHaveBeenCalledWith(cardId, listId);
    });
  });

  describe('deleteCard', () => {
    it('should delete a card', async () => {
      const cardId = 'valid-card-id';

      await service.deleteCard(cardId);

      expect(repository.deleteCard).toHaveBeenCalledWith(cardId);
    });
  });
});
