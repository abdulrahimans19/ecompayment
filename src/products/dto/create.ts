import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  IsEmpty,
} from 'class-validator';

export class addProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsNumber()
  count: number;

  
  image_url: string;
}
