export const roleNames = ['WARRIOR', 'MAGE', 'ROGUE', 'PRIEST'] as const;
export type RoleName = (typeof roleNames)[number];
export const RoleNames = Object.fromEntries(roleNames.map((r) => [r, r]));
