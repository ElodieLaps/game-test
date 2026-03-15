export const helmetNames = ["SAUCEPAN", "WOODEN_HELMET"] as const;
export type HelmetName = (typeof helmetNames)[number];
export const HelmetNames = Object.fromEntries(helmetNames.map((h) => [h, h]));
