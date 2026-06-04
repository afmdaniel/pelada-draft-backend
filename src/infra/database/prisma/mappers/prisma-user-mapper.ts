import {
  User as PrismaUser,
  GlobalRole as PrismaGlobalRole,
} from '../../generated/prisma/client';
import { User as UserEntity } from '../../../../core/domain/entities/user.entity';
import { DataCorruptionError } from '../../../../core/domain/errors';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): UserEntity {
    const userOrError = UserEntity.create(
      {
        email: raw.email,
        username: raw.username,
        password: raw.password,
        role: raw.role,
      },
      raw.id,
    );

    if (userOrError.isFailure) {
      throw new DataCorruptionError(
        `Falha ao mapear User (ID: ${raw.id}). Motivo: ${userOrError.error.message}`,
      );
    }

    return userOrError.value;
  }

  static toPrisma(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
      role: user.role as PrismaGlobalRole,
    };
  }
}
