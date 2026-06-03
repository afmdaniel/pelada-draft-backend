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
