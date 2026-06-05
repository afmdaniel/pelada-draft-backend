import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  IsEnum,
  Length,
  Matches,
} from 'class-validator';
import { PlayerPosition } from '../../../core/domain/constants/player-position';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerBody {
  @ApiProperty({
    description:
      'Nome do jogador entre 2 e 40 caracteres, sem caracteres especiais e números.',
    examples: ['Neymar Jr', 'Messi', 'Cristiano Ronaldo'],
    minLength: 3,
    maxLength: 40,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 40, {
    message: 'O nome do jogador deve ter entre 2 e 40 caracteres.',
  })
  @Matches(/^[a-zA-ZÀ-ÿ ]+$/, {
    message:
      'O nome do jogador não pode conter números ou caracteres especiais.',
  })
  name!: string;

  @ApiProperty({
    description: 'Estrelas do jogador entre 0 e 10.',
    example: 6,
    minimum: 0,
    maximum: 10,
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  stars!: number;

  @ApiProperty({
    description: 'Posição do jogador.',
    enum: PlayerPosition,
    examples: ['ATAQUE', 'ZAGA', 'MEIO'],
  })
  @IsOptional()
  @IsEnum(PlayerPosition, { message: 'Posição inválida.' })
  position?: PlayerPosition;
}
