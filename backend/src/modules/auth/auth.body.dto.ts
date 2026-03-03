import { IsNotEmpty, IsString } from 'class-validator';

export class AuthBodyDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  password: string;
}
