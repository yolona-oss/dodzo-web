import {AppErrorTypeEnum} from './../enums/app-error-type.enum';
import {HttpStatus} from '@nestjs/common';

export interface IErrorMessage {
    type: AppErrorTypeEnum;
    httpStatus: HttpStatus;
    cause: string;
    message: string;
}
