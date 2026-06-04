import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { PeladaNotFoundError } from '../../domain/errors';

interface DeletePeladaInput {
  peladaId: string;
}

type DeletePeladaOutput = Result<void, AppError>;

@Injectable()
export class DeletePelada {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: DeletePeladaInput): Promise<DeletePeladaOutput> {
    const pelada = await this.peladaRepository.findById(input.peladaId);

    if (!pelada) {
      return Result.fail(new PeladaNotFoundError());
    }

    await this.peladaRepository.delete(pelada.id!);

    return Result.ok<void>(undefined);
  }
}
