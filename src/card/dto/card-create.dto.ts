import { IsNotEmpty, IsString } from 'class-validator';
export class CardCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
