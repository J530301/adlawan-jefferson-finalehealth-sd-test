// Filename: backend/src/visits/dto/create-visit.dto.ts
import { IsString, IsDateString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateVisitDto {
  @IsOptional()
  @IsMongoId()
  patientId?: string;

  @IsNotEmpty()
  @IsDateString()
  visitDate: string;

  @IsNotEmpty()
  @IsString()
  visitType: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
