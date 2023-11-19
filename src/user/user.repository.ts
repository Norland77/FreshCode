import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto';
import { genSaltSync, hashSync } from 'bcrypt';

@Controller('user')
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUserById(Id: string) {
    return this.prismaService.user.findFirst({
      where: {
        id: Id,
      },
    });
  }

  deleteUserById(Id: string) {
    return this.prismaService.user.delete({
      where: {
        id: Id,
      },
    });
  }

  getUserByName(username: string, email: string) {
    return this.prismaService.user.findFirst({
      where: {
        AND: { username, email },
      },
    });
  }

  createUser(dto: RegisterDto) {
    const hashedPassword = this.hashPassword(dto.password);
    return this.prismaService.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
      },
    });
  }

  private hashPassword(password: string | undefined) {
    if (!password) {
      return '';
    }
    return hashSync(password, genSaltSync(10));
  }

  findUserByEmail(email: string) {
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
  }

  findUserByToken(token: string) {
    return this.prismaService.token.findFirst({
      where: {
        token,
      },
      select: {
        userId: true,
      },
    });
  }
}
