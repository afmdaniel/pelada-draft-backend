import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { UserWithPermissions } from '../dtos';

interface FetchPeladaUsersInput {
  peladaId: string;
}

type FetchPeladaUsersOutput = Result<UserWithPermissions[], AppError>;

@Injectable()
export class FetchPeladaUsers {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: FetchPeladaUsersInput): Promise<FetchPeladaUsersOutput> {
    const users = await this.peladaRepository.findUsersByPeladaId(
      input.peladaId,
    );

    if (!users || users.length === 0) {
      return Result.ok([]);
    }

    return Result.ok(users);
  }
}
