import { Test, TestingModule } from '@nestjs/testing';
import { ArticulosRevistasService } from './articulos-revistas.service';

describe('ArticulosRevistasService', () => {
  let service: ArticulosRevistasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticulosRevistasService],
    }).compile();

    service = module.get<ArticulosRevistasService>(ArticulosRevistasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
