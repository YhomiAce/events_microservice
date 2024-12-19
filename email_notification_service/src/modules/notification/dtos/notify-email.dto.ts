import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class NotifyEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    eventTitle: string;

    @IsString()
    @IsNotEmpty()
    requesterName: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}

export class RequestDecisionNotificationDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    eventTitle: string;

    @IsString()
    @IsNotEmpty()
    status: string;

}