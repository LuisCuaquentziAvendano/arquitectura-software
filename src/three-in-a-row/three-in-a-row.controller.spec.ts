import { Test, TestingModule } from '@nestjs/testing';
import { ThreeInARowController } from './three-in-a-row.controller';

describe('ThreeInARowController', () => {
  let controller: ThreeInARowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreeInARowController],
    }).compile();

    controller = module.get<ThreeInARowController>(ThreeInARowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
