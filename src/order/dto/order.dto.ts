import { IsString, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  readonly user_id: string;

  @IsString()
  readonly product_id: string;

  @IsNumber()
  readonly totalAmount: number;

  @IsString()
  readonly payment_status: string;
}
