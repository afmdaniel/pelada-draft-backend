import { Test, TestingModule } from '@nestjs/testing';
import { PeladaController } from './pelada.controller';

describe('PeladaController', () => {
  let controller: PeladaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeladaController],
    }).compile();

    controller = module.get<PeladaController>(PeladaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
