/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return API working message', () => {
      const result = { message: 'API working' };
      jest.spyOn(appService, 'healthCheck').mockReturnValue(result);
      expect(appController.healthCheck()).toEqual(result);
      expect(appService.healthCheck).toHaveBeenCalled();
    });
  });
});
