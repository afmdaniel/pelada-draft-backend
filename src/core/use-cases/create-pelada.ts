import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../repositories/pelada-repository';
import { Pelada } from '../entities/pelada.entity';

interface CreatePeladaInput {
  ownerId: string;
  name: string;
}

@Injectable()
export class CreatePelada {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: CreatePeladaInput): Promise<Pelada> {
    if (!input.name || input.name.trim() === '') {
      throw new Error('O nome da pelada é obrigatório.');
    }

    const pelada = new Pelada({
      ownerId: input.ownerId,
      name: input.name,
    });

    await this.peladaRepository.create(pelada);

    return pelada;
  }
}
