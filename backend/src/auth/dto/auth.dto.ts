import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    timezone?: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
