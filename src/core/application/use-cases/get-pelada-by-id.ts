import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { PeladaDetails } from '../dtos/pelada-details.dto';
import { PELADA_PRIVILEGES } from '../../domain/entities/pelada-permission.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { PeladaNotFoundError } from '../../domain/errors';

interface GetPeladaByIdInput {
  peladaId: string;
  currentUserId: string;
  currentUserRole: string;
}

type GetPeladaByIdOutput = Result<PeladaDetails, AppError>;

@Injectable()
export class GetPeladaById {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: GetPeladaByIdInput): Promise<GetPeladaByIdOutput> {
    const peladaDetails = await this.peladaRepository.findDetailsById(
      input.peladaId,
      input.currentUserId,
    );

    if (!peladaDetails) {
      return Result.fail(new PeladaNotFoundError());
    }

    const formattedDetails = {
      ...peladaDetails,
      privileges:
        peladaDetails.ownerId === input.currentUserId ||
        input.currentUserRole === 'ADMIN'
          ? Object.values(PELADA_PRIVILEGES)
          : peladaDetails.privileges,
    };

    return Result.ok(formattedDetails);
  }
}
