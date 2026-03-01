import { IsNotEmpty, IsString } from 'class-validator';
import type { GenderName } from './gender/type';
import type { RaceName } from './race/type';
import type { RoleName } from './role/type';

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

  @IsString()
  @IsNotEmpty()
  userId: string;
}
