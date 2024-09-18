import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoTrabajoService } from './documentos-trabajo.service';

describe('DocumentoTrabajoService', () => {
  let service: DocumentoTrabajoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentoTrabajoService],
    }).compile();

    service = module.get<DocumentoTrabajoService>(DocumentoTrabajoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
