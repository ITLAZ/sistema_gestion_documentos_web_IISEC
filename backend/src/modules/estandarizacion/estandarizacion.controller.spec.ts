import { Test, TestingModule } from '@nestjs/testing';
import { EstandarizacionController } from './estandarizacion.controller';

describe('EstandarizacionController', () => {
  let controller: EstandarizacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstandarizacionController],
    }).compile();

    controller = module.get<EstandarizacionController>(EstandarizacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
