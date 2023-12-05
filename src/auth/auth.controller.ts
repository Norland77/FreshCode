import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { IToken } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Cookie, Public } from '../../libs/common/src/decorators';

const REFRESH_TOKEN = 'refreshtoken';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    if (!user) {
      throw new BadRequestException(
        `Can't register user with data ${JSON.stringify(dto)}`,
      );
    }
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const token = await this.authService.login(dto);
    if (!token) {
      throw new BadRequestException(
        `Can't login user with data ${JSON.stringify(dto)}`,
      );
    }
    this.setRefreshTokenToCookies(token, res);
  }

  @Get('logout')
  async logout(
    @Cookie(REFRESH_TOKEN) refreshtoken: string,
    @Res() res: Response,
  ) {
    if (!refreshtoken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }
    await this.authService.logout(refreshtoken);
    res.cookie(REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });
    res.sendStatus(HttpStatus.OK);
  }

  @Get('refresh-tokens')
  async refreshtoken(
    @Cookie(REFRESH_TOKEN) refreshtoken: string,
    @Res() res: Response,
  ) {
    const string = '';
    if (typeof refreshtoken !== typeof string) {
      throw new UnauthorizedException();
    }

    const token = await this.authService.refreshtoken(refreshtoken);

    this.setRefreshTokenToCookies(token, res);
  }

  private setRefreshTokenToCookies(tokens: IToken, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }
    res.cookie(REFRESH_TOKEN, tokens.refreshtoken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshtoken.exp),
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }
}
