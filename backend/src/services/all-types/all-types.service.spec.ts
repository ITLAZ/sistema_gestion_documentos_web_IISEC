import { Test, TestingModule } from '@nestjs/testing';
import { AllTypesService } from './all-types.service';

describe('AllTypesService', () => {
  let service: AllTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllTypesService],
    }).compile();

    service = module.get<AllTypesService>(AllTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
