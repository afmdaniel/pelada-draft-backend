import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user-repository';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token-repository';
import { HashGenerator } from '../../domain/services/hash-generator';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { InvalidPasswordError, UserNotFoundError } from '../../domain/errors';

interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

type AddPlayerOutput = Result<void, AppError>;

@Injectable()
export class ChangePassword {
  constructor(
    private userRepository: UserRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(input: ChangePasswordInput): Promise<AddPlayerOutput> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      return Result.fail(new UserNotFoundError());
    }

    const isCurrentPasswordValid = await this.hashGenerator.compare(
      input.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return Result.fail(new InvalidPasswordError());
    }

    const hashedNewPassword = await this.hashGenerator.hash(input.newPassword);

    await this.userRepository.updatePassword(input.userId, hashedNewPassword);
    await this.refreshTokenRepository.deleteByUserId(input.userId);

    return Result.ok(undefined);
  }
}
