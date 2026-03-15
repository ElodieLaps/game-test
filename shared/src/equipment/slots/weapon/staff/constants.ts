export const staffNames = ["WALNUT_BRANCH", "WOODEN_STAFF"] as const;
export type StaffName = (typeof staffNames)[number];
export const StaffNames = Object.fromEntries(staffNames.map((h) => [h, h]));
