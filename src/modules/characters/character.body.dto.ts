import { IsNotEmpty, IsString } from 'class-validator';
import type { GenderName } from './genders/types';
import type { RaceName } from './races/types';
import type { RoleName } from './roles/types';

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
