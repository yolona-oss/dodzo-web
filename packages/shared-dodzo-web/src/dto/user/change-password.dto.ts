import { IsString, Length } from 'class-validator';
import { MAX_USER_PASSWORD_LENGTH, MIN_USER_PASSWORD_LENGTH } from '../../constants';

export class ChangePasswordDto {
    @IsString()
    @Length(MIN_USER_PASSWORD_LENGTH, MAX_USER_PASSWORD_LENGTH)
    oldPassword: string

    @IsString()
    @Length(MIN_USER_PASSWORD_LENGTH, MAX_USER_PASSWORD_LENGTH)
    newPassword: string
}
