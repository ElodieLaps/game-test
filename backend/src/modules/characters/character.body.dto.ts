import type { CustomStatistics, GenderName, RaceName, RoleName } from '@shared';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

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

  @IsObject()
  @ValidateNested()
  customStatistics: CustomStatistics;
}
