import { Test, TestingModule } from '@nestjs/testing';
import { CapitulosLibrosService } from './capitulos-libros.service';

describe('CapitulosLibrosService', () => {
  let service: CapitulosLibrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapitulosLibrosService],
    }).compile();

    service = module.get<CapitulosLibrosService>(CapitulosLibrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
