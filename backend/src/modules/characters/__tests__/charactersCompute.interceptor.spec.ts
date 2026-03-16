import { CharactersComputeInterceptor } from '@characters/charactersCompute.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('CharactersComputeInterceptor', () => {
  let interceptor: CharactersComputeInterceptor;

  const mockContext = {} as ExecutionContext;

  const mockNext = (value: any): CallHandler => ({
    handle: () => of(value),
  });

  const mockCharacter = {
    id: 'char-1',
    name: 'Hugo',
    race: 'HUMAN',
    role: 'WARRIOR',
    level: 1,
    currentHealth: 100,
    currentMana: 50,
    currentExperience: 0,
    statuses: [],
    customStatistics: { STRENGTH: 5 },
    equipments: {
      HEAD: 'SAUCEPAN',
      CHEST: null,
      LEGS: null,
      FEET: null,
      HANDS: null,
      WEAPON: 'WOODEN_SPOON',
      SHIELD: 'SAUCEPAN_LID',
      ACCESSORY: null,
    },
  };

  beforeEach(() => {
    interceptor = new CharactersComputeInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should compute stats for a single character', (done) => {
    interceptor
      .intercept(mockContext, mockNext(mockCharacter))
      .subscribe((result) => {
        expect(result.computedStats).toBeDefined();
        expect(result.experienceToNextLevel).toBeDefined();
        done();
      });
  });

  it('should compute stats for an array of characters', (done) => {
    interceptor
      .intercept(mockContext, mockNext([mockCharacter, mockCharacter]))
      .subscribe((result) => {
        expect(Array.isArray(result)).toBe(true);
        expect(result[0].computedStats).toBeDefined();
        expect(result[1].computedStats).toBeDefined();
        done();
      });
  });

  it('should return null if character is null', (done) => {
    interceptor.intercept(mockContext, mockNext(null)).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return character as is if race is unknown', (done) => {
    const unknownRace = { ...mockCharacter, race: 'UNKNOWN' };
    interceptor
      .intercept(mockContext, mockNext(unknownRace))
      .subscribe((result) => {
        expect(result.computedStats).toBeUndefined();
        done();
      });
  });

  it('should apply custom statistics bonus', (done) => {
    interceptor
      .intercept(mockContext, mockNext(mockCharacter))
      .subscribe((result) => {
        expect(result.computedStats.STRENGTH.custom).toBe(5);
        expect(result.computedStats.STRENGTH.total).toBe(
          result.computedStats.STRENGTH.base +
            5 +
            result.computedStats.STRENGTH.equipment,
        );
        done();
      });
  });

  it('should apply equipment bonus', (done) => {
    interceptor
      .intercept(mockContext, mockNext(mockCharacter))
      .subscribe((result) => {
        expect(result.computedStats.STRENGTH.equipment).toBeGreaterThan(0);
        done();
      });
  });

  it('should compute experienceToNextLevel', (done) => {
    interceptor
      .intercept(mockContext, mockNext(mockCharacter))
      .subscribe((result) => {
        expect(result.experienceToNextLevel).toBe(100);
        done();
      });
  });

  it('should increase base stats with level', (done) => {
    const level5Character = {
      ...mockCharacter,
      level: 5,
      customStatistics: {},
    };
    interceptor
      .intercept(mockContext, mockNext(level5Character))
      .subscribe((result) => {
        expect(result.computedStats.HEALTH.base).toBeGreaterThan(100);
        done();
      });
  });
});
