import type { GenderName, RaceName, RoleName } from '@shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class CharacterBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  gender: GenderName;

  @IsString()
  @IsNotEmpty()
  race: RaceName;

  @IsString()
  @IsNotEmpty()
  role: RoleName;
}
