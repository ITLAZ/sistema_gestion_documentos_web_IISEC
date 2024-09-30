import { Test, TestingModule } from '@nestjs/testing';
import { IdeasReflexionesService } from './ideas-reflexiones.service';

describe('IdeasReflexionesService', () => {
  let service: IdeasReflexionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdeasReflexionesService],
    }).compile();

    service = module.get<IdeasReflexionesService>(IdeasReflexionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
