export const raceNames = ['HUMAN', 'ELF', 'DWARF', 'ORC', 'KIRIN'] as const;
export type RaceName = (typeof raceNames)[number];
export const RaceNames = Object.fromEntries(raceNames.map((r) => [r, r]));
