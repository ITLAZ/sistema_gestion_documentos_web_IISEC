import { Test, TestingModule } from '@nestjs/testing';
import { InfoIisecService } from './info-iisec.service';

describe('InfoIisecService', () => {
  let service: InfoIisecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfoIisecService],
    }).compile();

    service = module.get<InfoIisecService>(InfoIisecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
