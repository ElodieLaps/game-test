export const swordNames = ["WOODEN_SPOON", "WOODEN_SWORD"] as const;
export type SwordName = (typeof swordNames)[number];
export const SwordNames = Object.fromEntries(swordNames.map((h) => [h, h]));
