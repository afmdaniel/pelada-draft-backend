import { ApiProperty } from '@nestjs/swagger';
import { PlayerSummaryDto } from './player-response.dto';

export class TeamDto {
  @ApiProperty({ example: 25 })
  totalStars!: number;

  @ApiProperty({ type: [PlayerSummaryDto] })
  players!: PlayerSummaryDto[];
}

export class DrawPayloadDto {
  @ApiProperty({ type: [TeamDto] })
  draw!: TeamDto[];
}

export class DrawTeamsResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Sorteio realizado com sucesso.' })
  message!: string;

  @ApiProperty({ type: DrawPayloadDto })
  data!: DrawPayloadDto;
}
