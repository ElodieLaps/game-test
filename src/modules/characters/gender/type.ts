export const genderNames = ['MALE', 'FEMALE', 'OTHER'] as const;
export type GenderName = (typeof genderNames)[number];
export const GenderNames = Object.fromEntries(genderNames.map((g) => [g, g]));
