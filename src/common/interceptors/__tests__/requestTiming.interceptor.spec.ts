import { CallHandler, ExecutionContext } from '@nestjs/common';
import { RequestTimingInterceptor } from '@src/common/interceptors/requestTiming.interceptor';
import { of } from 'rxjs';

describe('RequestTimingInterceptor', () => {
  let interceptor: RequestTimingInterceptor;

  beforeEach(() => {
    interceptor = new RequestTimingInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should call next.handle() and measure time', (done) => {
    const next: CallHandler = {
      handle: jest.fn(() => of('response')),
    };

    const context: ExecutionContext = {} as any;

    interceptor.intercept(context, next).subscribe((result) => {
      expect(next.handle).toHaveBeenCalled();

      expect(result).toBe('response');

      done();
    });
  });
});
