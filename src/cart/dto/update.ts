import { IsString, IsNotEmpty, IsArray, IsNumber } from "class-validator";

export class UpdateCartDto {


    cart_id: string;

    @IsNumber()
    @IsNotEmpty()
    itemIndex: number;

    @IsNumber()
    @IsNotEmpty()
    newCount: number;
}