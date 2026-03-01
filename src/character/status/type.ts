export const StatusNames = [
  'POISONED',
  'BLESSED',
  'DEAD',
  'STUNNED',
  'BLEEDING',
  'FROZEN',
  'BURNING',
] as const;
export type StatusName = (typeof StatusNames)[number];
export const statusName = Object.fromEntries(StatusNames.map((s) => [s, s]));
