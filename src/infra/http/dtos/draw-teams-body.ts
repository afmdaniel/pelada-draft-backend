import { IsArray, IsNumber, IsString, Min } from 'class-validator';

export class DrawTeamsBody {
  @IsArray()
  @IsString({ each: true })
  playersIds!: string[];

  @IsNumber()
  @Min(2)
  teamsQuantity!: number;
}
