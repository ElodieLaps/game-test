import { CharacterCreateInterceptor } from '@src/modules/characters/charactersCreate.interceptor';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { of } from 'rxjs';

describe('CharacterCreateInterceptor', () => {
  let interceptor: CharacterCreateInterceptor;

  beforeEach(() => {
    interceptor = new CharacterCreateInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should enrich request body with equipments, currentHp, currentMana and currentXp', (done) => {
    const mockRequest: any = {
      body: {
        race: 'HUMAN',
        role: 'WARRIOR',
      },
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const mockNext: CallHandler = {
      handle: () => of('ok'),
    };

    interceptor.intercept(mockContext, mockNext).subscribe(() => {
      expect(mockRequest.body.equipments).toBeDefined();
      expect(mockRequest.body.currentHp).toBeDefined();
      expect(mockRequest.body.currentMana).toBeDefined();
      expect(mockRequest.body.currentXp).toBe(0);
      done();
    });
  });

  it('should throw if race is invalid', () => {
    const mockRequest: any = {
      body: {
        race: 'INVALID_RACE',
        role: 'WARRIOR',
      },
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const mockNext: CallHandler = {
      handle: () => of('next'),
    };

    expect(() => interceptor.intercept(mockContext, mockNext)).toThrow(
      BadRequestException,
    );
  });
});
