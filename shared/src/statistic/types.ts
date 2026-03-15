import { RaceName } from "../character";
import { DWARF, ELF, HUMAN } from "./bases";
import { StatisticName } from "./constants";

export const CREATION_POINTS: Record<RaceName, number> = {
  HUMAN: 15,
  ELF: 30,
  DWARF: 15,
};

export type Statistic = {
  name: StatisticName;
  currentValue: number;
  value: number;
  progressIndex: number;
};

export type BaseStatistic = {
  value: number;
  progressIndex: number;
};

export type ExperienceStatistic = {
  value: number;
  progressIndex: number;
};

export type RaceStatistics = {
  experience: ExperienceStatistic;
  statistics: Record<StatisticName, BaseStatistic>;
};

export type CustomStatistics = Partial<Record<StatisticName, number>>;

export const baseStatistics = {
  HUMAN,
  ELF,
  DWARF,
} satisfies Record<RaceName, RaceStatistics>;
