import { RaceName } from '../races/types';
import DWARF from './data/dwarf';
import ELF from './data/elf';
import HUMAN from './data/human';
import KIRIN from './data/kirin';
import ORC from './data/orc';
import { Statistics } from './types';

export const statistics = {
  HUMAN,
  ELF,
  DWARF,
  ORC,
  KIRIN,
} satisfies Record<RaceName, Statistics>;

export default statistics;
