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

export class CreatePlayerBody {
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

  @IsNumber()
  @Min(0)
  @Max(10)
  stars!: number;

  @IsOptional()
  @IsEnum(PlayerPosition, { message: 'Posição inválida.' })
  position?: PlayerPosition;
}
