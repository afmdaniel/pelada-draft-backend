import { ApiProperty } from '@nestjs/swagger';
import { PlayerDto } from './player-response.dto';

export class TeamDto {
  @ApiProperty({ example: 'Time 1' })
  name!: string;

  @ApiProperty({ type: [PlayerDto] })
  players!: PlayerDto[];
}

export class DrawDataDto {
  @ApiProperty({ type: [TeamDto] })
  teams!: TeamDto[];
}

export class DrawPayloadDto {
  @ApiProperty({ type: DrawDataDto })
  draw!: DrawDataDto;
}

export class DrawTeamsResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Sorteio realizado com sucesso.' })
  message!: string;

  @ApiProperty({ type: DrawPayloadDto })
  data!: DrawPayloadDto;
}
