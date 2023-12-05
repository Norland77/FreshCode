import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { Response } from 'express';
import {
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IToken } from './interfaces';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let responseMock: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refreshtoken: jest.fn(),
            logout: jest.fn(),
          },
        },
        ConfigService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    responseMock = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    } as unknown as Response;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const dto: RegisterDto = {
        username: 'Norland',
        email: 'niki@gmail.com',
        password: '090902020909',
        passwordRepeat: '090902020909',
      };
      const userMock = {
        id: '',
        username: 'Norland',
        email: 'niki@gmail.com',
        password: '',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(userMock);

      const result = await controller.register(dto);

      expect(result).toBe(userMock);
    });

    it('should throw BadRequestException if registration fails', async () => {
      const dto: RegisterDto = {
        username: 'Norland',
        email: 'niki@gmail.com',
        password: '090902020909',
        passwordRepeat: '090902020909',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(null);

      await expect(controller.register(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const dto: LoginDto = {
        email: 'niki@gmail.com',
        password: '090902020909',
      };
      const userMock: IToken = {
        accessToken: '',
        refreshtoken: {
          userId: '',
          exp: new Date(),
          token: '',
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(userMock);

      await controller.login(dto, responseMock);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(responseMock.cookie).toHaveBeenCalled();
      expect(responseMock.status).toHaveBeenCalledWith(201);
      expect(responseMock.json).toHaveBeenCalledWith({
        accessToken: userMock.accessToken,
      });
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout, clear cookies, and send OK status if refreshtoken is provided', async () => {
      const refreshtoken = 'valid-refresh-token';

      await controller.logout(refreshtoken, responseMock);

      expect(authService.logout).toHaveBeenCalledWith(refreshtoken);
      expect(responseMock.cookie).toHaveBeenCalledWith('refreshtoken', '', {
        httpOnly: true,
        secure: true,
        expires: expect.any(Date),
      });
      expect(responseMock.sendStatus).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });

  describe('refreshtoken', () => {
    it('should throw UnauthorizedException if refreshtoken is not a string', async () => {
      const invalidRefreshtoken = 123;

      await expect(() =>
        controller.refreshtoken(
          invalidRefreshtoken as unknown as string,
          responseMock,
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.refreshtoken).not.toHaveBeenCalled();
      expect(responseMock.cookie).not.toHaveBeenCalled();
      expect(responseMock.sendStatus).not.toHaveBeenCalled();
    });

    it('should call setRefreshTokenToCookies and return successfully if refreshtoken is valid', async () => {
      const validRefreshtoken = 'valid-refresh-token';
      const tokenMock: IToken = {
        accessToken: '',
        refreshtoken: {
          userId: '',
          exp: new Date(),
          token: '',
        },
      };

      jest.spyOn(authService, 'refreshtoken').mockResolvedValueOnce(tokenMock);

      await controller.refreshtoken(validRefreshtoken, responseMock);

      expect(authService.refreshtoken).toHaveBeenCalledWith(validRefreshtoken);
      expect(responseMock.cookie).toHaveBeenCalledWith(
        'refreshtoken',
        tokenMock.refreshtoken.token,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          path: '/',
          sameSite: 'lax',
          expires: expect.any(Date),
        }),
      );
      expect(responseMock.sendStatus).not.toHaveBeenCalled();
    });
  });
});
