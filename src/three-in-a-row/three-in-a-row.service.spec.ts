import { Test, TestingModule } from '@nestjs/testing';
import { ThreeInARowService } from './three-in-a-row.service';

describe('ThreeInARowService', () => {
  let service: ThreeInARowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThreeInARowService],
    }).compile();

    service = module.get<ThreeInARowService>(ThreeInARowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
