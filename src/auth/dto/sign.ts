import {
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsString,
    MinLength,
  } from 'class-validator';
import { userRoles } from '../schema/auth.schema';
  
  export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;
    @IsNotEmpty()
    @IsEmail({}, { message: 'please enter corect email' })
    readonly email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
    @IsNotEmpty()
    @IsString()
    @IsIn([userRoles.ADMIN, userRoles.USER])
    readonly roles: string;
  }
  