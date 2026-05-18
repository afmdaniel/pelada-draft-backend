import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { HashGenerator } from '../services/hash-generator';
import { Encrypter } from '../services/encrypter';

interface AuthenticateUserInput {
  identifier: string;
  password: string;
}

interface AuthenticateUserOutput {
  accessToken: string;
}

@Injectable()
export class AuthenticateUser {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const user = await this.userRepository.findByIdentifier(input.identifier);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isPasswordValid = await this.hashGenerator.compare(
      input.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Senha incorreta');
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id,
      role: user.role,
    });

    return { accessToken };
  }
}
