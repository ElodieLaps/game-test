import { AppService } from '../app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('healthCheck should return a string containing "health check :"', () => {
    const result = service.healthCheck();
    expect(result).toMatch(/^health check : \d+$/); // regex pour vérifier le timestamp
  });
});
