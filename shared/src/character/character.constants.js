"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSlotNames = exports.equipmentSlotNames = exports.statusName = exports.StatusNames = exports.StatisticNames = exports.statisticNames = exports.RoleNames = exports.roleNames = exports.RaceNames = exports.raceNames = exports.GenderNames = exports.genderNames = void 0;
exports.genderNames = ["MALE", "FEMALE", "OTHER"];
exports.GenderNames = Object.fromEntries(exports.genderNames.map((g) => [g, g]));
exports.raceNames = ["HUMAN", "ELF", "DWARF", "ORC", "KIRIN"];
exports.RaceNames = Object.fromEntries(exports.raceNames.map((r) => [r, r]));
exports.roleNames = ["WARRIOR", "MAGE", "ROGUE", "PRIEST"];
exports.RoleNames = Object.fromEntries(exports.roleNames.map((r) => [r, r]));
exports.statisticNames = [
    "EXPERIENCE",
    "HEALTH",
    "HEALTH_REGEN",
    "MANA",
    "MANA_REGEN",
    "ARMOR",
    "PROTECTION",
    "BENEDICTION",
    "STRENGTH",
    "POWER",
    "AURA",
    "VELOCITY",
    "DEXTERITY",
    "DODGE",
];
exports.StatisticNames = Object.fromEntries(exports.statisticNames.map((s) => [s, s]));
exports.StatusNames = [
    "POISONED",
    "BLESSED",
    "DEAD",
    "STUNNED",
    "BLEEDING",
    "FROZEN",
    "BURNING",
];
exports.statusName = Object.fromEntries(exports.StatusNames.map((s) => [s, s]));
exports.equipmentSlotNames = [
    "HEAD",
    "CHEST",
    "LEGS",
    "FEET",
    "HANDS",
    "WEAPON",
    "SHIELD",
    "ACCESSORY",
];
exports.EquipmentSlotNames = Object.fromEntries(exports.equipmentSlotNames.map((s) => [s, s]));
//# sourceMappingURL=character.constants.js.map