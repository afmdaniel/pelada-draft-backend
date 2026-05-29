import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../repositories/pelada-repository';
import { Pelada } from '../entities/pelada.entity';

interface UpdatePeladaInput {
  peladaId: string;
  name: string;
}

@Injectable()
export class UpdatePelada {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: UpdatePeladaInput): Promise<Pelada> {
    if (!input.name || input.name.trim() === '') {
      throw new Error('O nome da pelada é obrigatório.');
    }

    const pelada = await this.peladaRepository.findById(input.peladaId);

    if (!pelada) {
      throw new Error('Pelada não encontrada.');
    }

    const newPelada = new Pelada({
      id: pelada.id,
      ownerId: pelada.ownerId,
      name: input.name,
    });

    await this.peladaRepository.update(newPelada);

    return newPelada;
  }
}
