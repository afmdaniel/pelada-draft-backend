import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  IsEnum,
} from 'class-validator';
import { PlayerPosition } from '../../../core/constants/player-position';

export class UpdatePlayerBody {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  stars!: number;

  @IsOptional()
  @IsEnum(PlayerPosition, { message: 'Posição inválida.' })
  position?: PlayerPosition;
}
