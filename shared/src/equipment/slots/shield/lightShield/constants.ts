export const lightShieldNames = ["SAUCEPAN_LID", "WOODEN_SHIELD"] as const;
export type LightShieldName = (typeof lightShieldNames)[number];
export const LightShieldNames = Object.fromEntries(
  lightShieldNames.map((h) => [h, h]),
);
