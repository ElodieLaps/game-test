export declare const genderNames: readonly ["MALE", "FEMALE", "OTHER"];
export type GenderName = (typeof genderNames)[number];
export declare const GenderNames: {
    [k: string]: "MALE" | "FEMALE" | "OTHER";
};
export declare const raceNames: readonly ["HUMAN", "ELF", "DWARF", "ORC", "KIRIN"];
export type RaceName = (typeof raceNames)[number];
export declare const RaceNames: {
    [k: string]: "HUMAN" | "ELF" | "DWARF" | "ORC" | "KIRIN";
};
export declare const roleNames: readonly ["WARRIOR", "MAGE", "ROGUE", "PRIEST"];
export type RoleName = (typeof roleNames)[number];
export declare const RoleNames: {
    [k: string]: "WARRIOR" | "MAGE" | "ROGUE" | "PRIEST";
};
export declare const statisticNames: readonly ["EXPERIENCE", "HEALTH", "HEALTH_REGEN", "MANA", "MANA_REGEN", "ARMOR", "PROTECTION", "BENEDICTION", "STRENGTH", "POWER", "AURA", "VELOCITY", "DEXTERITY", "DODGE"];
export type StatisticName = (typeof statisticNames)[number];
export declare const StatisticNames: {
    [k: string]: "EXPERIENCE" | "HEALTH" | "HEALTH_REGEN" | "MANA" | "MANA_REGEN" | "ARMOR" | "PROTECTION" | "BENEDICTION" | "STRENGTH" | "POWER" | "AURA" | "VELOCITY" | "DEXTERITY" | "DODGE";
};
export declare const StatusNames: readonly ["POISONED", "BLESSED", "DEAD", "STUNNED", "BLEEDING", "FROZEN", "BURNING"];
export type StatusName = (typeof StatusNames)[number];
export declare const statusName: {
    [k: string]: "POISONED" | "BLESSED" | "DEAD" | "STUNNED" | "BLEEDING" | "FROZEN" | "BURNING";
};
export declare const equipmentSlotNames: readonly ["HEAD", "CHEST", "LEGS", "FEET", "HANDS", "WEAPON", "SHIELD", "ACCESSORY"];
export type EquipmentSlotName = (typeof equipmentSlotNames)[number];
export declare const EquipmentSlotNames: {
    [k: string]: "HEAD" | "CHEST" | "LEGS" | "FEET" | "HANDS" | "WEAPON" | "SHIELD" | "ACCESSORY";
};
