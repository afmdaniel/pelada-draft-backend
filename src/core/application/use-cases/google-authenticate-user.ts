import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user-repository';
import { User } from '../../domain/entities/user.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import {
  TokenIssuerService,
  type AuthTokens,
} from '../services/token-issuer.service';

interface GoogleAuthenticateUserInput {
  googleId: string;
  email: string;
  displayName: string;
}

type GoogleAuthenticateUserOutput = Result<AuthTokens, AppError>;

@Injectable()
export class GoogleAuthenticateUser {
  constructor(
    private userRepository: UserRepository,
    private tokenIssuer: TokenIssuerService,
  ) {}

  async execute(
    input: GoogleAuthenticateUserInput,
  ): Promise<GoogleAuthenticateUserOutput> {
    let user = await this.userRepository.findByGoogleId(input.googleId);

    if (!user) {
      user = await this.userRepository.findByEmail(input.email);

      if (user) {
        await this.userRepository.updateGoogleId(user.id, input.googleId);
      } else {
        const username = await this.generateUniqueUsername(
          input.email,
          input.displayName,
        );

        const userOrError = User.create({
          email: input.email,
          username,
          googleId: input.googleId,
          authProvider: 'GOOGLE',
        });

        if (userOrError.isFailure) {
          return Result.fail(userOrError.error);
        }

        user = userOrError.value;
        await this.userRepository.create(user);
      }

      user = (await this.userRepository.findByGoogleId(input.googleId))!;
    }

    return this.tokenIssuer.issueTokens(user.id, user.role!);
  }

  private async generateUniqueUsername(
    email: string,
    displayName: string,
  ): Promise<string> {
    const sanitized = (str: string) =>
      str.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^_+|_+$/g, '');

    const fromDisplay = sanitized(displayName).slice(0, 15);
    const fromEmail = sanitized(email.split('@')[0]).slice(0, 15);

    const base = fromDisplay.length >= 3 ? fromDisplay : fromEmail;
    const candidate = base.length >= 3 ? base : 'user';

    const existing = await this.userRepository.findByUsername(candidate);
    if (!existing) return candidate;

    const suffix = Math.floor(1000 + Math.random() * 9000);
    return `${candidate.slice(0, 11)}_${suffix}`;
  }
}
