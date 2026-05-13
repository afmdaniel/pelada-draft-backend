import { Test, TestingModule } from '@nestjs/testing';
import { PeladaController } from './pelada.controller';
import { AddPlayerToPelada } from '../../../../core/use-cases/add-player-to-pelada';
import { GetPlayersByPelada } from '../../../../core/use-cases/get-player-by-pelada';

describe('PeladaController', () => {
  let controller: PeladaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeladaController],
      providers: [
        {
          provide: AddPlayerToPelada,
          useValue: { execute: jest.fn() }, // Mock básico
        },
        {
          provide: GetPlayersByPelada,
          useValue: { execute: jest.fn() }, // Mock básico
        },
      ],
    }).compile();

    controller = module.get<PeladaController>(PeladaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
