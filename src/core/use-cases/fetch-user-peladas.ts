import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../repositories/pelada-repository';
import { PeladaWithPermissions } from '../dtos/pelada-with-permissions.dto';
import { PELADA_PRIVILEGES } from '../entities/pelada-permission.entity';

interface FetchUserPeladasInput {
  userId: string;
  userRole: string;
}

@Injectable()
export class FetchUserPeladas {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(
    input: FetchUserPeladasInput,
  ): Promise<PeladaWithPermissions[]> {
    const peladas = await this.peladaRepository.findManyByUserId(
      input.userId,
      input.userRole,
    );

    return peladas.map((pelada) => ({
      ...pelada,
      privileges:
        pelada.ownerId === input.userId || input.userRole === 'ADMIN'
          ? Object.values(PELADA_PRIVILEGES)
          : pelada.privileges,
    }));
  }
}
