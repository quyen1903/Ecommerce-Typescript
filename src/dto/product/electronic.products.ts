import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateElectronicsDTO {
  @IsNotEmpty()
  @IsString()
  manufacturer: string;

  @IsNotEmpty()
  @IsString()
  models: string;

  @IsNotEmpty()
  @IsString()
  color: string;
}

export class UpdateElectronicsDTO {
  @IsOptional()
  @IsString()
  manufacturer: string;

  @IsOptional()
  @IsString()
  models: string;

  @IsOptional()
  @IsString()
  color: string;
}
