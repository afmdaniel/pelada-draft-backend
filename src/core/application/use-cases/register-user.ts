// src/core/use-cases/register-user.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user-repository';
import { HashGenerator } from '../../domain/services/hash-generator';
import { User } from '../../domain/entities/user.entity';

interface RegisterUserInput {
  email: string;
  username: string;
  password: string;
}

@Injectable()
export class RegisterUser {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const emailExists = await this.userRepository.findByEmail(input.email);
    if (emailExists) {
      throw new Error('Este e-mail já está em uso.');
    }

    const usernameExists = await this.userRepository.findByUsername(
      input.username,
    );
    if (usernameExists) {
      throw new Error('Este nome de usuário já está em uso.');
    }

    const hashedPassword = await this.hashGenerator.hash(input.password);

    const user = new User({
      email: input.email,
      username: input.username,
      password: hashedPassword,
      role: 'USER',
    });

    await this.userRepository.create(user);

    return user;
  }
}
