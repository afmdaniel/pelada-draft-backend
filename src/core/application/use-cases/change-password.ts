import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user-repository';
import { HashGenerator } from '../../domain/services/hash-generator';

interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

@Injectable()
export class ChangePassword {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const isCurrentPasswordValid = await this.hashGenerator.compare(
      input.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new Error('Senha atual incorreta.');
    }

    const hashedNewPassword = await this.hashGenerator.hash(input.newPassword);

    await this.userRepository.updatePassword(input.userId, hashedNewPassword);
  }
}
