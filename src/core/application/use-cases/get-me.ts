import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user-repository';
import { Result } from '../../domain/logic/result';
import { User } from '../../domain/entities/user.entity';
import { AppError } from '../../domain/errors/app-error';
import { UnauthorizedError } from '../../domain/errors/domain-errors';

type GetMeOutput = Result<User, AppError>;

@Injectable()
export class GetMe {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<GetMeOutput> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return Result.fail(new UnauthorizedError('Usuário não encontrado.'));
    }

    return Result.ok(user);
  }
}
