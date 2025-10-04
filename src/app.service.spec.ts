import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return API working message', () => {
      const result = service.healthCheck();
      expect(result).toEqual({ message: 'API working' });
    });
  });
});
