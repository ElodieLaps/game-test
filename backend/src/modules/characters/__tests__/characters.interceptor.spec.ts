import { CharacterInterceptor } from '@characters/characters.interceptor';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { of } from 'rxjs';

describe('CharacterInterceptor', () => {
  let interceptor: CharacterInterceptor;
  let mockCharacterService: any;

  beforeEach(() => {
    mockCharacterService = {
      applyEquipmentBonuses: jest.fn(),
    };

    interceptor = new CharacterInterceptor(mockCharacterService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should enrich request body with statistics and equipments', (done) => {
    const mockRequest: any = {
      body: {
        race: 'HUMAN',
        role: 'PRIEST',
      },
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({}),
        getNext: () => jest.fn(),
      }),
    } as unknown as ExecutionContext;

    const mockNext: CallHandler = {
      handle: () => of('ok'),
    };

    interceptor.intercept(mockContext, mockNext).subscribe(() => {
      expect(mockRequest.body.statistics).toBeDefined();
      expect(mockRequest.body.equipments).toBeDefined();
      expect(mockCharacterService.applyEquipmentBonuses).toHaveBeenCalled();
      done();
    });
  });

  it('should throw if race is invalid', () => {
    const mockRequest: any = {
      body: {
        race: 'INVALID_RACE',
        role: 'PRIEST',
      },
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({}),
        getNext: () => jest.fn(),
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
