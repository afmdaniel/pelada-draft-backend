// src/infra/http/presenters/user-presenter.ts
import { User } from '../../../core/entities/user.entity';

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}
