import { IsEmail, IsOptional, IsString, Length, IsPhoneNumber, IsArray, IsEnum } from 'class-validator';
import { Role } from '../../types/roles.type';
// import { MAX_USER_PASSWORD_LENGTH, MIN_USER_PASSWORD_LENGTH } from '../../constants/password'

export class CreateUserDto {
    @IsOptional()
    googleId?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    // @Length(MIN_USER_PASSWORD_LENGTH, MAX_USER_PASSWORD_LENGTH)
    @IsOptional()
    password: string;

    @IsString()
    @Length(5, 255)
    firstName: string;

    @IsString()
    @Length(5, 255)
    lastName: string;

    @IsOptional()
    @IsArray()
    @IsEnum(Role, { each: true })
    roles?: Role[];
}
