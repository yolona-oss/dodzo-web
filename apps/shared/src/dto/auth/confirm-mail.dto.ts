import { IsString, Length } from 'class-validator';

export class ConfirmMailDto {
    @IsString()
    @Length(1, 255)
    token: string;
}

export class ResendConfirmMailDto {
    @IsString()
    @Length(1, 255)
    email: string;
}
