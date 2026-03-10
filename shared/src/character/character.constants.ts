export const genderNames = ["MALE", "FEMALE", "OTHER"] as const;
export type GenderName = (typeof genderNames)[number];
export const GenderNames = Object.fromEntries(genderNames.map((g) => [g, g]));

export const raceNames = ["HUMAN", "ELF", "DWARF", "ORC", "KIRIN"] as const;
export type RaceName = (typeof raceNames)[number];
export const RaceNames = Object.fromEntries(raceNames.map((r) => [r, r]));

export const roleNames = ["WARRIOR", "MAGE", "ROGUE", "PRIEST"] as const;
export type RoleName = (typeof roleNames)[number];
export const RoleNames = Object.fromEntries(roleNames.map((r) => [r, r]));

export const statisticNames = [
  "EXPERIENCE",
  // VITAL
  "HEALTH",
  "HEALTH_REGEN", // indice de récupération de point de vie à chaque tour
  "MANA",
  "MANA_REGEN", // indice de récupération de point de mana à chaque tour
  // RESISTENCE
  "ARMOR", // protection contre les dégats physique
  "PROTECTION", // protection contre les dégats magiques
  "BENEDICTION", // augmenter la puissance du soin reçu
  // ABILITY
  "STRENGTH", // dégats physique
  "POWER", // dégats magique
  "AURA", // pouvoir de soin
  //MOBILITY
  "VELOCITY",
  "DEXTERITY",
  "DODGE",
] as const;
export type StatisticName = (typeof statisticNames)[number];
export const StatisticNames = Object.fromEntries(
  statisticNames.map((s) => [s, s]),
);

export const StatusNames = [
  "POISONED",
  "BLESSED",
  "DEAD",
  "STUNNED",
  "BLEEDING",
  "FROZEN",
  "BURNING",
] as const;
export type StatusName = (typeof StatusNames)[number];
export const statusName = Object.fromEntries(StatusNames.map((s) => [s, s]));

export const equipmentSlotNames = [
  "HEAD",
  "CHEST",
  "LEGS",
  "FEET",
  "HANDS",
  "WEAPON",
  "SHIELD",
  "ACCESSORY",
] as const;
export type EquipmentSlotName = (typeof equipmentSlotNames)[number];
export const EquipmentSlotNames = Object.fromEntries(
  equipmentSlotNames.map((s) => [s, s]),
);
