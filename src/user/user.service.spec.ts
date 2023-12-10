import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { RegisterDto } from '../auth/dto';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('findUserById', () => {
    it('should return a user when a valid ID is provided', async () => {
      const userId = 'valid-user-id';
      const mockUser = {
        id: userId,
        username: 'testuser',
        email: 'testuser@example.com',
        password: '17984168489',
      };

      jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValueOnce(mockUser);

      const result = await service.findUserById(userId);

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
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
        password: '0516181665165',
      };

      jest
        .spyOn(userRepository, 'deleteUserById')
        .mockResolvedValueOnce(mockDeletedUser);

      const result = await service.deleteUserById(userId);

      expect(userRepository.deleteUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockDeletedUser);
    });
  });

  describe('getUserByName', () => {
    it('should return a user when a valid username and email are provided', async () => {
      const username = 'testuser';
      const email = 'testuser@example.com';
      const password = '18654879498';
      const mockUser = {
        id: 'user-id',
        username,
        email,
        password,
      };

      jest
        .spyOn(userRepository, 'getUserByName')
        .mockResolvedValueOnce(mockUser);

      const result = await service.getUserByName(username, email);

      expect(userRepository.getUserByName).toHaveBeenCalledWith(
        username,
        email,
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create a new user when valid registration data is provided', async () => {
      const registerDto: RegisterDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        passwordRepeat: 'password123',
      };

      const mockCreatedUser = {
        id: 'new-user-id',
        username: registerDto.username,
        email: registerDto.email,
        password: registerDto.password,
      };

      jest
        .spyOn(userRepository, 'createUser')
        .mockResolvedValueOnce(mockCreatedUser);

      const result = await service.createUser(registerDto);

      expect(userRepository.createUser).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user when a valid email is provided', async () => {
      const email = 'testuser@example.com';
      const password = '15717848778';
      const mockUser = {
        id: 'user-id',
        username: 'testuser',
        email,
        password,
      };

      jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValueOnce(mockUser);

      const result = await service.findUserByEmail(email);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserByToken', () => {
    it('should return a user when a valid token is provided', async () => {
      const token = 'valid-token';
      const mockUser = {
        userId: '1876164865',
      };

      jest
        .spyOn(userRepository, 'findUserByToken')
        .mockResolvedValueOnce(mockUser);

      const result = await service.findUserByToken(token);

      expect(userRepository.findUserByToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockUser);
    });
  });
});
