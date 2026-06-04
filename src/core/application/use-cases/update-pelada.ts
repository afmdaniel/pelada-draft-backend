import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { Pelada } from '../../domain/entities/pelada.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import {
  MissingPeladaNameError,
  PeladaNotFoundError,
} from '../../domain/errors';

interface UpdatePeladaInput {
  peladaId: string;
  name: string;
}

type UpdatePeladaOutput = Result<Pelada, AppError>;

@Injectable()
export class UpdatePelada {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: UpdatePeladaInput): Promise<UpdatePeladaOutput> {
    if (!input.name || input.name.trim() === '') {
      return Result.fail(new MissingPeladaNameError());
    }

    const pelada = await this.peladaRepository.findById(input.peladaId);

    if (!pelada) {
      return Result.fail(new PeladaNotFoundError());
    }

    const newPeladaOrError = Pelada.create({
      id: pelada.id,
      ownerId: pelada.ownerId,
      name: input.name,
    });

    if (newPeladaOrError.isFailure) {
      return Result.fail(newPeladaOrError.error);
    }

    const newPelada = newPeladaOrError.value;

    await this.peladaRepository.update(newPelada);

    return Result.ok(newPelada);
  }
}
