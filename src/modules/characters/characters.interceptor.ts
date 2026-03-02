import { Character } from '@characters/character.entity';
import { CharacterService } from '@characters/characters.service';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { getStarterEquipment } from './equipment/utils';
import type { RoleName } from './roles/types';
import statistics from './statistics';

@Injectable()
export class CharacterInterceptor implements NestInterceptor {
  constructor(private readonly characterService: CharacterService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { race, role } = request.body;
    const stats = statistics[race];

    if (!stats) {
      throw new BadRequestException('Invalid race');
    }

    const equipments = getStarterEquipment(role as RoleName);
    const statsWithBonuses = JSON.parse(JSON.stringify(stats));
    const equipmentList = Object.values(equipments).filter((e) => e !== null);

    const tempCharacter = {
      statistics: statsWithBonuses,
    } as Character;

    this.characterService['applyEquipmentBonuses'](
      tempCharacter,
      equipmentList,
    );

    request.body = {
      ...request.body,
      statistics: tempCharacter.statistics,
      equipments,
    };

    return next.handle();
  }
}
