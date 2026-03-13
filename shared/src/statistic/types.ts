import { RaceName, Statistics } from "../character";
import { StatisticName } from "./constants";
import DWARF from "./raceStatistics/dwarf";
import ELF from "./raceStatistics/elf";
import HUMAN from "./raceStatistics/human";
import KIRIN from "./raceStatistics/kirin";
import ORC from "./raceStatistics/orc";

export type Statistic = {
  name: StatisticName;
  currentValue: number;
  value: number;
  progressIndex: number;
};

export const starterStatistics = {
  HUMAN,
  ELF,
  DWARF,
  ORC,
  KIRIN,
} satisfies Record<RaceName, Statistics>;
