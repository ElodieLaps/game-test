const ELF = {
  EXPERIENCE: {
    currentValue: 0,
    value: 100,
    progressIndex: 0,
  },
  // VITAL
  HEALTH: { currentValue: 80, value: 80, progressIndex: 4 },
  HEALTH_REGEN: {
    currentValue: 1.5,
    value: 1.5,
    progressIndex: 0.15,
  },
  MANA: { currentValue: 120, value: 120, progressIndex: 6 },
  MANA_REGEN: {
    currentValue: 3,
    value: 3,
    progressIndex: 0.3,
  },
  // RESISTANCE
  ARMOR: { currentValue: 6, value: 6, progressIndex: 0.5 },
  PROTECTION: {
    currentValue: 15,
    value: 15,
    progressIndex: 1.5,
  },
  BENEDICTION: {
    currentValue: 10,
    value: 10,
    progressIndex: 1,
  },
  // ABILITY
  STRENGTH: {
    currentValue: 6,
    value: 6,
    progressIndex: 0.5,
  },
  POWER: { currentValue: 15, value: 15, progressIndex: 1.5 },
  AURA: { currentValue: 12, value: 12, progressIndex: 1.2 },
  // MOBILITY
  VELOCITY: {
    currentValue: 15,
    value: 15,
    progressIndex: 1.2,
  },
  DEXTERITY: {
    currentValue: 14,
    value: 14,
    progressIndex: 1.4,
  },
  DODGE: { currentValue: 10, value: 10, progressIndex: 1 },
};

export default ELF;
