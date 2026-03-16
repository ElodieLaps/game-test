export const tiaraNames = [
  "PANTY_ELASTIC",
  "SILVER_TIARA",
  "GOLDEN_TIARA",
] as const;
export type TiaraName = (typeof tiaraNames)[number];
export const TiaraNames = Object.fromEntries(tiaraNames.map((h) => [h, h]));
