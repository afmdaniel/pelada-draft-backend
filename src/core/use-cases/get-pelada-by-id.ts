import { Injectable, NotFoundException } from '@nestjs/common';
import { PeladaRepository } from '../repositories/pelada-repository';
import { PeladaDetails } from '../dtos/pelada-details.dto';
import { PELADA_PRIVILEGES } from '../entities/pelada-permission.entity';

interface GetPeladaByIdInput {
  peladaId: string;
  currentUserId: string;
  currentUserRole: string;
}

@Injectable()
export class GetPeladaById {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: GetPeladaByIdInput): Promise<PeladaDetails> {
    const peladaDetails = await this.peladaRepository.findDetailsById(
      input.peladaId,
      input.currentUserId,
    );

    if (!peladaDetails) {
      throw new NotFoundException('Pelada não encontrada.');
    }

    return {
      ...peladaDetails,
      privileges:
        peladaDetails.ownerId === input.currentUserId ||
        input.currentUserRole === 'ADMIN'
          ? Object.values(PELADA_PRIVILEGES)
          : peladaDetails.privileges,
    };
  }
}
