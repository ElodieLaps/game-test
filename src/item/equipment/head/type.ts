export const headTypeNames = ['HELMET'] as const;
export type HeadTypeName = (typeof headTypeNames)[number];
export const HeadTypeNames = Object.fromEntries(
  headTypeNames.map((w) => [w, w]),
);
