import { Test, TestingModule } from '@nestjs/testing';
import { EstandarizacionService } from './estandarizacion.service';

describe('EstandarizacionService', () => {
  let service: EstandarizacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstandarizacionService],
    }).compile();

    service = module.get<EstandarizacionService>(EstandarizacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
