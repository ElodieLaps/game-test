import { getStarterEquipment } from '@characters/utils';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { baseStatistics, RaceName, RoleName } from '@shared';
import { Observable } from 'rxjs';

@Injectable()
export class CharacterCreateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { race, role, customStatistics } = request.body;

    const baseStats = baseStatistics[race as RaceName];
    if (!baseStats) throw new BadRequestException('Invalid race');

    const equipments = getStarterEquipment(role as RoleName);

    const healthBase = baseStats.statistics.HEALTH.value;
    const healthCustom = customStatistics?.HEALTH ?? 0;

    request.body = {
      ...request.body,
      equipments,
      currentHealth: healthBase + healthCustom,
      currentMana:
        baseStats.statistics.MANA.value + (customStatistics?.MANA ?? 0),
      currentExperience: 0,
    };

    return next.handle();
  }
}
