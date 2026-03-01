import { IsNotEmpty, IsString } from 'class-validator';

export class AuthBodyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  password: string;
}
