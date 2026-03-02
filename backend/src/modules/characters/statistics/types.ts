export const statisticNames = [
  'EXPERIENCE',
  // VITAL
  'HEALTH',
  'HEALTH_REGEN', // indice de récupération de point de vie à chaque tour
  'MANA',
  'MANA_REGEN', // indice de récupération de point de mana à chaque tour
  // RESISTENCE
  'ARMOR', // protection contre les dégats physique
  'PROTECTION', // protection contre les dégats magiques
  'BENEDICTION', // augmenter la puissance du soin reçu
  // ABILITY
  'STRENGTH', // dégats physique
  'POWER', // dégats magique
  'AURA', // pouvoir de soin
  //MOBILITY
  'VELOCITY',
  'DEXTERITY',
  'DODGE',
] as const;
export type StatisticName = (typeof statisticNames)[number];
export const StatisticNames = Object.fromEntries(
  statisticNames.map((s) => [s, s]),
);

export type Statistic = {
  name: StatisticName;
  currentValue: number;
  value: number;
  progressIndex: number;
};

export type Statistics = Record<StatisticName, Omit<Statistic, 'name'>>;
