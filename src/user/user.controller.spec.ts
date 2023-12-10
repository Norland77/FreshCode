import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, UserRepository, PrismaService],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('findUserById', () => {
    it('should return a user when a valid ID is provided', async () => {
      const userId = 'valid-user-id';
      const mockUser = {
        id: userId,
        username: 'testuser',
        email: 'testuser@example.com',
        password: '1234667891',
      };

      jest.spyOn(userService, 'findUserById').mockResolvedValueOnce(mockUser);

      const result = await controller.findUserById(userId);

      expect(userService.findUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user when a valid ID is provided', async () => {
      const userId = 'valid-user-id';
      const mockDeletedUser = {
        id: userId,
        username: 'testuser',
        email: 'testuser@example.com',
        password: '16165416516',
      };

      jest
        .spyOn(userService, 'deleteUserById')
        .mockResolvedValueOnce(mockDeletedUser);

      const result = await controller.deleteUserById(userId);

      expect(userService.deleteUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockDeletedUser);
    });
  });
});
