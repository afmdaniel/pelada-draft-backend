import { ApiProperty } from '@nestjs/swagger';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';
import { PlayerSummaryDto } from './player-response.dto';

export class PeladaDto {
  @ApiProperty({ example: 'd3f6630f-b1e1-450f-a496-d249f0f90e5f' })
  id!: string;

  @ApiProperty({ example: 'Pelada de Sábado' })
  name!: string;

  @ApiProperty({ example: 'c1b4432a-d2e3-4f9e-b123-e456f0f70a1c' })
  ownerId!: string;
}

export class PeladaWithPermissionsDto {
  @ApiProperty({ example: 'd3f6630f-b1e1-450f-a496-d249f0f90e5f' })
  id!: string;

  @ApiProperty({ example: 'Pelada de Sábado' })
  name!: string;

  @ApiProperty({ example: 'usuario123' })
  ownerUsername!: string;

  @ApiProperty({
    enum: PeladaPrivilege,
    isArray: true,
    example: ['MANAGE_PLAYERS', 'DRAW_TEAMS'],
  })
  privileges!: PeladaPrivilege[];
}

export class PeladaWithDetailsDto {
  @ApiProperty({ example: 'd3f6630f-b1e1-450f-a496-d249f0f90e5f' })
  id!: string;

  @ApiProperty({ example: 'Pelada de Sábado' })
  name!: string;

  @ApiProperty({ example: 'usuario123' })
  ownerUsername!: string;

  @ApiProperty({
    enum: PeladaPrivilege,
    isArray: true,
    example: ['MANAGE_PLAYERS', 'DRAW_TEAMS'],
  })
  privileges!: PeladaPrivilege[];

  @ApiProperty({ type: [PlayerSummaryDto] })
  players!: PlayerSummaryDto[];
}

export class PeladaDataDto {
  @ApiProperty({ type: PeladaDto })
  pelada!: PeladaDto;
}

export class ListPeladasDataDto {
  @ApiProperty({ type: [PeladaWithPermissionsDto] })
  peladas!: PeladaWithPermissionsDto[];
}

export class PeladaDetailsDataDto {
  @ApiProperty({ type: PeladaWithDetailsDto })
  pelada!: PeladaWithDetailsDto;
}

export class CreatePeladaResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Pelada criada com sucesso.' })
  message!: string;

  @ApiProperty({ type: PeladaDataDto })
  data!: PeladaDataDto;
}

export class ListPeladasResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Lista de peladas retornada com sucesso.' })
  message!: string;

  @ApiProperty({ type: ListPeladasDataDto })
  data!: ListPeladasDataDto;
}

export class GetPeladaByIdResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Detalhes da pelada retornados com sucesso.' })
  message!: string;

  @ApiProperty({ type: PeladaDetailsDataDto })
  data!: PeladaDetailsDataDto;
}

export class UpdatePeladaResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Pelada atualizada com sucesso.' })
  message!: string;

  @ApiProperty({ type: PeladaDataDto })
  data!: PeladaDataDto;
}
