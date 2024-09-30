import { Test, TestingModule } from '@nestjs/testing';
import { AllTypesController } from '../all-types.controller';

describe('AllTypesController', () => {
  let controller: AllTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllTypesController],
    }).compile();

    controller = module.get<AllTypesController>(AllTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
