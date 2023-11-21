import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../user/user.repository';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let authController: AuthController;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        AuthRepository,
        UserService,
        JwtService,
        PrismaService,
        UserRepository,
        ConfigService,
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should return an user', async () => {
      const userDto = {
        username: 'Nik3',
        email: 'nik3',
        password: '123456789',
        passwordRepeat: '123456789',
      };
      /*jest.spyOn(authService, 'register').mockImplementation(() =>
        Promise.resolve({
          id: '',
          username: '',
          email: '',
          password: '',
        }),
      );*/
      const result = await authController.register(userDto);

      expect(result.id).toEqual(expect.any(String));
      expect(result.username).toEqual(expect.any(String));
      expect(result.email).toEqual(expect.any(String));
      expect(result.password).toEqual(expect.any(String));
    });
  });
});
