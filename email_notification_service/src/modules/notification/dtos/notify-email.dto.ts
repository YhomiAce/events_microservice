import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class NotifyEmailDto {
    @IsEmail()
    @IsNotEmpty()
    toEmail: string;

    @IsString()
    @IsString()
    @IsNotEmpty()
    eventTitle: string;

    @IsString()
    @IsString()
    @IsNotEmpty()
    requesterName: string;
}