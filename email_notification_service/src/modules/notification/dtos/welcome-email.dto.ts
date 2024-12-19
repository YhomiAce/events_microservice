import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class WelcomeEmailDto {
    @IsEmail()
    @IsNotEmpty()
    toEmail: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}