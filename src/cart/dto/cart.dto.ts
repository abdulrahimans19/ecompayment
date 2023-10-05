import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class CartDto {

    @IsArray()
    @IsNotEmpty()
    items: any[];
}