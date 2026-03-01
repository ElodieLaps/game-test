import { IsNotEmpty, IsString } from 'class-validator';

export class TeamBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
