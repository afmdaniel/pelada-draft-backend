import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { GlobalRole } from '../../database/generated/prisma/enums';
import { authConfig } from '../../config/auth';
import {
  ExpiredTokenError,
  MissingAccessTokenError,
} from '../../../core/domain/errors';

export interface JwtPayload {
  sub: string;
  role: GlobalRole;
  iat?: number;
  exp?: number;
  jti?: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new MissingAccessTokenError();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: authConfig.jwt.accessTokenSecret,
      });

      request.user = payload;
    } catch (error) {
      console.error('Erro na validação do Access Token:', error);
      throw new ExpiredTokenError();
    }

    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    let token = request.cookies?.['access_token'] as string;

    if (!token) {
      const [type, authString] =
        request.headers.authorization?.split(' ') ?? [];
      if (type === 'Bearer') {
        token = authString;
      }
    }

    return token;
  }
}
