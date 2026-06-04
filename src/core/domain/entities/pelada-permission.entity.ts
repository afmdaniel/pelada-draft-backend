import { InvalidCredentialsError, MissingRelationsError } from '../errors';
import { Result } from '../logic/result';

export const PELADA_PRIVILEGES = {
  DRAW_TEAMS: 'DRAW_TEAMS',
  MANAGE_PLAYERS: 'MANAGE_PLAYERS',
} as const;

export type PeladaPrivilege =
  (typeof PELADA_PRIVILEGES)[keyof typeof PELADA_PRIVILEGES];

export interface PeladaPermissionProps {
  id?: string;
  userId: string;
  peladaId: string;
  privilege: PeladaPrivilege;
}

export class PeladaPermission {
  private props: PeladaPermissionProps;

  constructor(props: PeladaPermissionProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
    };
  }

  public static create(props: PeladaPermissionProps) {
    if (!props.userId || !props.peladaId) {
      return Result.fail(new MissingRelationsError());
    }

    const isValidPrivilege = Object.values(PELADA_PRIVILEGES).includes(
      props.privilege,
    );
    if (!isValidPrivilege) {
      return Result.fail(new InvalidCredentialsError());
    }

    return Result.ok(new PeladaPermission(props));
  }

  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get peladaId() {
    return this.props.peladaId;
  }
  get privilege() {
    return this.props.privilege;
  }
}
