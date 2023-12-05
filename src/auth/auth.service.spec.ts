import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { RegisterDto, LoginDto } from './dto';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refreshtoken: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      jest.spyOn(authRepository, 'register').mockResolvedValue(userMock);

      const result = await service.register(dto);

      expect(result).toBe(userMock);
    });

    describe('login', () => {
      it('should call authRepository.login with the provided login data', async () => {
        const loginDto: LoginDto = {
          email: 'niki@gmail.com',
          password: '090902020909',
        };

        await service.login(loginDto);

        expect(authRepository.login).toHaveBeenCalledWith(loginDto);
      });
    });

    describe('refreshtoken', () => {
      it('should call authRepository.refreshtoken with the provided refresh token', async () => {
        const refreshtoken = 'valid-refresh-token';

        await service.refreshtoken(refreshtoken);

        expect(authRepository.refreshtoken).toHaveBeenCalledWith(refreshtoken);
      });
    });

    describe('logout', () => {
      it('should call authRepository.logout with the provided refresh token', async () => {
        const refreshtoken = 'valid-refresh-token';

        await service.logout(refreshtoken);

        expect(authRepository.logout).toHaveBeenCalledWith(refreshtoken);
      });
    });
  });
});
