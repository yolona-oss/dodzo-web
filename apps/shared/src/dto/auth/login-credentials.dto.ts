import { IsNumber, IsPhoneNumber, IsString, Length } from 'class-validator';
export class LoginCredentials {
    @IsString()
    @Length(1,255)
    email?: string;

    @IsString()
    @Length(1,255)
    password?: string;

    @IsPhoneNumber()
    phone?: string

    @IsNumber()
    googleId?: string
}
