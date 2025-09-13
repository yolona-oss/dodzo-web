import { IsEmail, IsOptional, IsString, Length, IsPhoneNumber, IsArray, IsEnum } from 'class-validator';
import { Role } from '../../enums/Roles';
// import { MAX_USER_PASSWORD_LENGTH, MIN_USER_PASSWORD_LENGTH } from '../../constants/password'

export class CreateUserDto {
    @IsString()
    @Length(5, 255)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    // @Length(MIN_USER_PASSWORD_LENGTH, MAX_USER_PASSWORD_LENGTH)
    password: string;

    @IsOptional()
    @IsString()
    @Length(5, 255)
    firstName?: string;

    @IsOptional()
    @IsString()
    @Length(5, 255)
    lastName?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @IsOptional()
    @IsArray()
    @IsEnum(Role, { each: true })
    roles?: Role[];
}
