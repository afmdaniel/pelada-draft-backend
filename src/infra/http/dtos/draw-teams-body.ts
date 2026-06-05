import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString, Min } from 'class-validator';

export class DrawTeamsBody {
  @ApiProperty({
    description: 'Id dos jogadores a serem sorteados.',
    example: ['player1', 'player2', 'player3', 'player4'],
  })
  @IsArray()
  @IsString({ each: true })
  playersIds!: string[];

  @ApiProperty({
    description: 'Quantidade de times a serem sorteados.',
    example: 4,
    minimum: 2,
  })
  @IsNumber()
  @Min(2)
  teamsQuantity!: number;

  @ApiProperty({
    description: 'Deve considerar a posição dos jogadores?',
    examples: [true, false],
  })
  @IsBoolean()
  withPosition!: boolean;
}
