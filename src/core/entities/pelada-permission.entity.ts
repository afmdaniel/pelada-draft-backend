export type PlayerPrivilege = 'DRAW_TEAMS' | 'MANAGE_PLAYERS';

export interface PeladaPermissionProps {
  id?: string;
  userId: string;
  peladaId: string;
  privilege: PlayerPrivilege;
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
