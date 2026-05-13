import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePlayerBody {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  stars!: number;

  @IsOptional()
  @IsString()
  position?: 'Zaga' | 'Meio' | 'Ataque' | 'Geral';
}
