import {
  User as PrismaUser,
  GlobalRole as PrismaGlobalRole,
} from '../../generated/prisma/client';
import { User as UserEntity } from '../../../../core/entities/user.entity';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): UserEntity {
    return new UserEntity(
      {
        email: raw.email,
        username: raw.username,
        password: raw.password,
        role: raw.role,
      },
      raw.id,
    );
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
