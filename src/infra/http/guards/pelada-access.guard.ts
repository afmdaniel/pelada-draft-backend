import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma/prisma.service';
import { PRIVILEGE_KEY } from '../decorators/require-privilege.decorator';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';
import { AuthenticatedRequest } from './auth.guard';

@Injectable()
export class PeladaAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'Usuário não autenticado no contexto da requisição.',
      );
    }

    if (user.role === 'ADMIN') return true;

    const requiredPrivilege = this.reflector.get<PeladaPrivilege>(
      PRIVILEGE_KEY,
      context.getHandler(),
    );

    const peladaId = request.params.peladaId;
    if (!peladaId) return true;

    const pelada = await this.prisma.pelada.findUnique({
      where: { id: peladaId as string },
    });

    if (!pelada) {
      throw new NotFoundException('A pelada informada não foi encontrada.');
    }

    if (pelada.ownerId === user.sub) return true;

    if (requiredPrivilege) {
      const hasPermission = await this.prisma.peladaPermission.findFirst({
        where: {
          userId: user.sub,
          peladaId: pelada.id,
          privilege: {
            in: [requiredPrivilege, PeladaPrivilege.FULL_ACCESS],
          },
        },
      });

      if (!hasPermission) {
        throw new ForbiddenException(
          'Você não tem permissão para realizar esta ação nesta pelada.',
        );
      }
    } else {
      const hasAnyPermission = await this.prisma.peladaPermission.findFirst({
        where: { userId: user.sub, peladaId: pelada.id },
      });

      if (!hasAnyPermission) {
        throw new ForbiddenException('Você não tem acesso a esta pelada.');
      }
    }

    return true;
  }
}
