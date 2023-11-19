import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';
export class UserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password?: string;
}
