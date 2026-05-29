import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../repositories/pelada-repository';

interface DeletePeladaInput {
  peladaId: string;
}

@Injectable()
export class DeletePelada {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: DeletePeladaInput): Promise<void> {
    const pelada = await this.peladaRepository.findById(input.peladaId);

    if (!pelada) {
      throw new Error('Pelada não encontrada.');
    }

    await this.peladaRepository.delete(pelada.id!);
  }
}
