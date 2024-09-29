import { Test, TestingModule } from '@nestjs/testing';
import { PoliciesBriefsService } from './policies-briefs.service';

describe('PoliciesBriefsService', () => {
  let service: PoliciesBriefsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoliciesBriefsService],
    }).compile();

    service = module.get<PoliciesBriefsService>(PoliciesBriefsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
