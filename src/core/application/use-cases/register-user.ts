import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user-repository';
import { HashGenerator } from '../../domain/services/hash-generator';
import { User } from '../../domain/entities/user.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import {
  EmailAlreadyExistsError,
  UsernameAlreadyExistsError,
} from '../../domain/errors';

interface RegisterUserInput {
  email: string;
  username: string;
  password: string;
}

type RegisterUserOutput = Result<User, AppError>;

@Injectable()
export class RegisterUser {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const emailExists = await this.userRepository.findByEmail(input.email);
    if (emailExists) {
      return Result.fail(new EmailAlreadyExistsError());
    }

    const usernameExists = await this.userRepository.findByUsername(
      input.username,
    );
    if (usernameExists) {
      return Result.fail(new UsernameAlreadyExistsError());
    }

    const hashedPassword = await this.hashGenerator.hash(input.password);

    const userOrError = User.create({
      email: input.email,
      username: input.username,
      password: hashedPassword,
      role: 'USER',
    });

    if (userOrError.isFailure) {
      return Result.fail(userOrError.error);
    }

    const user = userOrError.value;

    await this.userRepository.create(user);

    return Result.ok(user);
  }
}
