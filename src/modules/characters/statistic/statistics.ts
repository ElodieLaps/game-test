import { RaceName } from '../race/type';
import DWARF from './dwarf';
import ELF from './elf';
import HUMAN from './human';
import KIRIN from './kirin';
import ORC from './orc';
import { Statistics } from './type';

export const statistics = {
  HUMAN,
  ELF,
  DWARF,
  ORC,
  KIRIN,
} satisfies Record<RaceName, Statistics>;

export default statistics;
