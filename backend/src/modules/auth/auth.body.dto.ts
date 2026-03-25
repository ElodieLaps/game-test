import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthBodyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
