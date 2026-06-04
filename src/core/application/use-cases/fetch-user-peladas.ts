import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { PeladaWithPermissions } from '../dtos/pelada-with-permissions.dto';
import { PELADA_PRIVILEGES } from '../../domain/entities/pelada-permission.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';

interface FetchUserPeladasInput {
  userId: string;
  userRole: string;
}

type FetchUserPeladasOutput = Result<PeladaWithPermissions[], AppError>;

@Injectable()
export class FetchUserPeladas {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: FetchUserPeladasInput): Promise<FetchUserPeladasOutput> {
    const peladas = await this.peladaRepository.findManyByUserId(
      input.userId,
      input.userRole,
    );

    const formattedPeladas = peladas.map((pelada) => ({
      ...pelada,
      privileges:
        pelada.ownerId === input.userId || input.userRole === 'ADMIN'
          ? Object.values(PELADA_PRIVILEGES)
          : pelada.privileges,
    }));

    return Result.ok(formattedPeladas);
  }
}
