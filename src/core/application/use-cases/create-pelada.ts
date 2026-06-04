import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { Pelada } from '../../domain/entities/pelada.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { InvalidPeladaNameError } from '../../domain/errors';

interface CreatePeladaInput {
  ownerId: string;
  name: string;
}

type CreatePeladaOutput = Result<Pelada, AppError>;

@Injectable()
export class CreatePelada {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: CreatePeladaInput): Promise<CreatePeladaOutput> {
    if (!input.name || input.name.trim() === '') {
      return Result.fail(new InvalidPeladaNameError());
    }

    const peladaOrError = Pelada.create({
      ownerId: input.ownerId,
      name: input.name,
    });

    if (peladaOrError.isFailure) {
      return Result.fail(peladaOrError.error);
    }

    const pelada = peladaOrError.value;

    await this.peladaRepository.create(pelada);

    return Result.ok(pelada);
  }
}
