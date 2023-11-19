import { IsNotEmpty, IsString } from 'class-validator';
export class BoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
