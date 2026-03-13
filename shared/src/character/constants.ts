export const genderNames = ["MALE", "FEMALE", "OTHER"] as const;
export type GenderName = (typeof genderNames)[number];
export const GenderNames = Object.fromEntries(genderNames.map((g) => [g, g]));

export const raceNames = ["HUMAN", "ELF", "DWARF", "ORC", "KIRIN"] as const;
export type RaceName = (typeof raceNames)[number];
export const RaceNames = Object.fromEntries(raceNames.map((r) => [r, r]));

export const roleNames = ["WARRIOR", "MAGE", "ROGUE", "PRIEST"] as const;
export type RoleName = (typeof roleNames)[number];
export const RoleNames = Object.fromEntries(roleNames.map((r) => [r, r]));

export const statusNames = [
  "POISONED",
  "BLESSED",
  "DEAD",
  "STUNNED",
  "BLEEDING",
  "FROZEN",
  "BURNING",
] as const;
export type StatusName = (typeof statusNames)[number];
export const StatusNames = Object.fromEntries(statusNames.map((s) => [s, s]));
