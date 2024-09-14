import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateClothingDTO {
  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsString()
  material: string;
}

export class UpdateClothingDTO {
  @IsOptional()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  size: string;

  @IsOptional()
  @IsString()
  material: string;
}

