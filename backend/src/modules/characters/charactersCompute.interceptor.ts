import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  baseStatistics,
  getEquipmentByName,
  EquipmentName,
  EquipmentSlotName,
  StatisticName,
  statisticNames,
} from '@shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CharactersComputeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((character) => {
        if (!character) return character;

        if (Array.isArray(character)) {
          return character.map((c) => this.compute(c));
        }

        return this.compute(character);
      }),
    );
  }

  private compute(character: any) {
    const base = baseStatistics[character.race];
    if (!base) return character;

    const computedStats: Record<
      string,
      {
        base: number;
        custom: number;
        equipment: number;
        total: number;
      }
    > = {};

    for (const statName of statisticNames) {
      const baseStat = base.statistics[statName];
      const baseValue = baseStat
        ? Math.round(
            baseStat.value + baseStat.progressIndex * (character.level - 1),
          )
        : 0;

      const customValue = character.customStatistics?.[statName] ?? 0;
      const equipmentValue = this.computeEquipmentBonus(character, statName);

      computedStats[statName] = {
        base: baseValue,
        custom: customValue,
        equipment: equipmentValue,
        total: baseValue + customValue + equipmentValue,
      };
    }

    return {
      ...character,
      experienceToNextLevel: Math.round(
        base.experience.value *
          Math.pow(base.experience.progressIndex, character.level - 1),
      ),
      computedStats,
    };
  }

  private computeEquipmentBonus(
    character: any,
    statName: StatisticName,
  ): number {
    let bonus = 0;

    for (const slot of Object.keys(
      character.equipments,
    ) as EquipmentSlotName[]) {
      const name = character.equipments[slot] as EquipmentName | null;
      if (!name) continue;

      const equipment = getEquipmentByName(name);
      const stat = equipment.statistics.find((s) => s.name === statName);
      if (stat) bonus += stat.value;
    }

    return bonus;
  }
}
