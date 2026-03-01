const HUMAN = {
  EXPERIENCE: {
    currentValue: 0,
    value: 100,
    progressIndex: 0,
  },
  // VITAL
  HEALTH: {
    currentValue: 100,
    value: 100,
    progressIndex: 5,
  },
  HEALTH_REGEN: {
    currentValue: 2,
    value: 2,
    progressIndex: 0.2,
  },
  MANA: { currentValue: 50, value: 50, progressIndex: 3 },
  MANA_REGEN: {
    currentValue: 1,
    value: 1,
    progressIndex: 0.1,
  },
  // RESISTANCE
  ARMOR: { currentValue: 10, value: 10, progressIndex: 1 },
  PROTECTION: {
    currentValue: 8,
    value: 8,
    progressIndex: 0.8,
  },
  BENEDICTION: {
    currentValue: 5,
    value: 5,
    progressIndex: 0.5,
  },
  // ABILITY
  STRENGTH: {
    currentValue: 10,
    value: 10,
    progressIndex: 1,
  },
  POWER: { currentValue: 8, value: 8, progressIndex: 0.8 },
  AURA: { currentValue: 5, value: 5, progressIndex: 0.5 },
  // MOBILITY
  VELOCITY: {
    currentValue: 10,
    value: 10,
    progressIndex: 0.8,
  },
  DEXTERITY: {
    currentValue: 10,
    value: 10,
    progressIndex: 1,
  },
  DODGE: { currentValue: 5, value: 5, progressIndex: 0.5 },
};

export default HUMAN;
