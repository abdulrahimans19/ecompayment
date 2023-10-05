import { IsString, IsOptional, IsDate } from 'class-validator';

export class OrderHistoryDto {
  @IsString()
  readonly user_id: string;

  @IsOptional()
  @IsDate()
  readonly startDate?: Date;

  @IsOptional()
  @IsDate()
  readonly endDate?: Date;
}
