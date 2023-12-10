import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './list.service';
import { ListRepository } from './list.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('ListService', () => {
  let service: ListService;
  let listRepository: ListRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListService, ListRepository, PrismaService],
    }).compile();

    service = module.get<ListService>(ListService);
    listRepository = module.get<ListRepository>(ListRepository);
  });

  it('should find list by title and board', async () => {
    const boardId = 'valid-board-id';
    const title = 'List Title';
    const mockList = {
      id: 'list-id',
      title: 'List Title',
      boardId: 'valid-board-id',
      createdAt: new Date(),
    };

    jest
      .spyOn(listRepository, 'findListByTitleAndBoard')
      .mockResolvedValueOnce(mockList);

    const result = await service.findListByTitleAndBoard(boardId, title);

    expect(listRepository.findListByTitleAndBoard).toHaveBeenCalledWith(
      boardId,
      title,
    );
    expect(result).toEqual(mockList);
  });

  it('should create a new list', async () => {
    const boardId = 'valid-board-id';
    const title = 'New List';
    const mockCreatedList = {
      id: 'new-list-id',
      title: 'New List',
      boardId: 'valid-board-id',
      createdAt: new Date(),
    };

    jest
      .spyOn(listRepository, 'createList')
      .mockResolvedValueOnce(mockCreatedList);

    const result = await service.createList(boardId, title);

    expect(listRepository.createList).toHaveBeenCalledWith(boardId, title);
    expect(result).toEqual(mockCreatedList);
  });

  it('should edit list by ID', async () => {
    const listId = 'valid-list-id';
    const title = 'Updated List';
    const mockEditedList = {
      id: 'valid-list-id',
      title: 'Updated List',
      boardId: 'valid-board-id',
      createdAt: new Date(),
    };

    jest
      .spyOn(listRepository, 'editListById')
      .mockResolvedValueOnce(mockEditedList);

    const result = await service.editListById(listId, title);

    expect(listRepository.editListById).toHaveBeenCalledWith(listId, title);
    expect(result).toEqual(mockEditedList);
  });

  it('should find list by ID', async () => {
    const listId = 'valid-list-id';
    const mockList = {
      id: 'valid-list-id',
      title: 'List Title',
      boardId: 'valid-board-id',
      createdAt: new Date(),
    };

    jest.spyOn(listRepository, 'findListById').mockResolvedValueOnce(mockList);

    const result = await service.findListById(listId);

    expect(listRepository.findListById).toHaveBeenCalledWith(listId);
    expect(result).toEqual(mockList);
  });

  it('should delete list by ID', async () => {
    const listId = 'valid-list-id';

    const deletedList = {
      id: '',
      title: '',
      boardId: '',
      createdAt: new Date(),
    };

    jest.spyOn(listRepository, 'deleteList').mockResolvedValueOnce(deletedList);

    const result = await service.deleteList(listId);

    expect(listRepository.deleteList).toHaveBeenCalledWith(listId);
    expect(result).toEqual(deletedList);
  });

  it('should get all lists for a board', async () => {
    const boardId = 'valid-board-id';
    const mockLists = [
      {
        id: 'list-id-1',
        title: 'List 1',
        cards: [
          {
            id: '',
            title: '',
            description: '',
            listId: '',
            comments: [
              {
                text: '',
                createdAt: new Date(),
                user: {
                  username: '',
                },
              },
            ],
          },
        ],
      },
    ];

    jest.spyOn(listRepository, 'getAllLists').mockResolvedValueOnce(mockLists);

    const result = await service.getAllLists(boardId);

    expect(listRepository.getAllLists).toHaveBeenCalledWith(boardId);
    expect(result).toEqual(mockLists);
  });
});
