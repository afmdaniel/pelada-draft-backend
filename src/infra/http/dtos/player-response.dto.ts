import { ApiProperty } from '@nestjs/swagger';
import { PlayerPosition } from '../../../core/domain/constants/player-position';

export class PlayerDto {
  @ApiProperty({ example: 'd3f6630f-b1e1-450f-a496-d249f0f90e5f' })
  id!: string;

  @ApiProperty({ example: 'Messi' })
  name!: string;

  @ApiProperty({ example: 10 })
  stars!: number;

  @ApiProperty({ enum: PlayerPosition, example: 'MEIO' })
  position!: PlayerPosition;
}

export class PlayerDataDto {
  @ApiProperty({ type: PlayerDto })
  player!: PlayerDto;
}

export class ListPlayersDataDto {
  @ApiProperty({ type: [PlayerDto] })
  players!: PlayerDto[];
}

export class CreatePlayerResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Jogador adicionado com sucesso.' })
  message!: string;

  @ApiProperty({ type: PlayerDataDto })
  data!: PlayerDataDto;
}

export class ListPlayersResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Lista de jogadores retornada com sucesso.' })
  message!: string;

  @ApiProperty({ type: ListPlayersDataDto })
  data!: ListPlayersDataDto;
}

export class UpdatePlayerResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Jogador atualizado com sucesso.' })
  message!: string;

  @ApiProperty({ type: PlayerDataDto })
  data!: PlayerDataDto;
}
