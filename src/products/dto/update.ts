import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class updateProductDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsArray()
  image_url: string;
}
