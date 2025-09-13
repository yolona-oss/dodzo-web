import { HttpStatus } from '@nestjs/common';
import { AppErrorTypeEnum } from './enums/app-error-type.enum';
import { IErrorMessage } from './interfaces/ierror-message.interface';

export const ErrorsDefenition: Record<AppErrorTypeEnum, IErrorMessage> = {
    [AppErrorTypeEnum.BAD_REQUEST]: {
        type: AppErrorTypeEnum.BAD_REQUEST,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'Bad Request',
        message: 'Bad Request'
    },
    [AppErrorTypeEnum.DB_ENTITY_EXISTS]: {
        type: AppErrorTypeEnum.DB_ENTITY_EXISTS,
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        cause: 'Entity exists',
        message: 'Entity exists'
    },
    [AppErrorTypeEnum.DB_CANNOT_READ]: {
        type: AppErrorTypeEnum.DB_CANNOT_READ,
        httpStatus: HttpStatus.NOT_FOUND,
        cause: 'Cannot read entity.',
        message: 'Cannot read entity.'
    },
    [AppErrorTypeEnum.DB_ENTITY_NOT_FOUND]: {
        type: AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
        cause: 'Entity not found',
        message: 'Unable to find the entity with the provided information.'
    },
    [AppErrorTypeEnum.DB_CANNOT_UPDATE]: {
        type: AppErrorTypeEnum.DB_CANNOT_UPDATE,
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        cause: 'Cannot update selected entity.',
        message: 'Cannot update selected entity.'
    },
    [AppErrorTypeEnum.DB_NOTHING_TO_UPDATE]: {
        type: AppErrorTypeEnum.DB_NOTHING_TO_UPDATE,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'Nothing to update.',
        message: 'Nothing to update, enter different data.'
    },
    [AppErrorTypeEnum.DB_CANNOT_CREATE]: {
        type: AppErrorTypeEnum.DB_CANNOT_CREATE,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'Entity cannot to be created.',
        message: 'Entity cannot to be created.'
    },
    [AppErrorTypeEnum.INVALID_CREDENTIALS_EXCEPTION]: {
        type: AppErrorTypeEnum.INVALID_CREDENTIALS_EXCEPTION,
        httpStatus: HttpStatus.NOT_ACCEPTABLE,
        cause: 'Invalid credentials.',
        message: 'Invalid credentials.'
    },
    [AppErrorTypeEnum.EMAIL_NOT_VERIFIED_EXCEPTION]: {
        type: AppErrorTypeEnum.EMAIL_NOT_VERIFIED_EXCEPTION,
        httpStatus: HttpStatus.NOT_ACCEPTABLE,
        cause: 'Email not verified.',
        message: 'Email not verified.'
    },
    [AppErrorTypeEnum.INVALID_OBJECT_ID]: {
        type: AppErrorTypeEnum.INVALID_OBJECT_ID,
        httpStatus: HttpStatus.NOT_ACCEPTABLE,
        cause: 'Invalid ObjectId passed.',
        message: 'Invalid ObjectId passed.'
    },
    [AppErrorTypeEnum.CANNOT_UPLOAD_IMAGE]: {
        type: AppErrorTypeEnum.CANNOT_UPLOAD_IMAGE,
        httpStatus: HttpStatus.BAD_REQUEST, // TODO change
        cause: 'Cannot upload image.',
        message: 'Cannot upload image.'
    },
    [AppErrorTypeEnum.INVALID_RANGE]: {
        type: AppErrorTypeEnum.INVALID_RANGE,
        httpStatus: HttpStatus.BAD_REQUEST, // TODO change
        cause: 'Not in ranger.',
        message: 'Selected range is invalid.'
    },
    [AppErrorTypeEnum.DB_INCORRECT_MODEL]: {
        type: AppErrorTypeEnum.DB_INCORRECT_MODEL,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'Incorrenct db model passed.',
        message: 'Cannot interact with database.'
    },
    [AppErrorTypeEnum.IMAGE_NOT_UPLOADED]: {
        type: AppErrorTypeEnum.IMAGE_NOT_UPLOADED,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'Image not uploaded. Cannot proceed.',
        message: 'Image not uploaded. Cannot proceed.'
    },
    [AppErrorTypeEnum.DB_CANNOT_DELETE]: {
        type: AppErrorTypeEnum.DB_CANNOT_DELETE,
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        cause: 'Cannot delete selected entity.',
        message: 'Cannot delete selected entity.'
    },
    [AppErrorTypeEnum.DUPLICATE_KEY]: {
        type: AppErrorTypeEnum.DUPLICATE_KEY,
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        cause: 'Duplicate key.',
        message: 'Duplicate key.'
    },
    [AppErrorTypeEnum.VALIDATION_ERROR]: {
        type: AppErrorTypeEnum.VALIDATION_ERROR,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'Validation error.',
        message: 'Validation error.'
    },
    [AppErrorTypeEnum.ROLE_ALREADY_PROVIDED]: {
        type: AppErrorTypeEnum.ROLE_ALREADY_PROVIDED,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'Role already provided.',
        message: 'Role already provided.'
    },
    [AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_LENGTH]: {
        type: AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_LENGTH,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'Insufficient user password length.',
        message: 'Insufficient user password length.'
    },
    [AppErrorTypeEnum.ROLE_NOT_PROVIDED]: {
        type: AppErrorTypeEnum.ROLE_NOT_PROVIDED,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'Role not provided.',
        message: 'Role not provided.'
    },
    [AppErrorTypeEnum.CLOUDINARY_ERROR]: {
        type: AppErrorTypeEnum.CLOUDINARY_ERROR,
        httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
        cause: 'Cloudinary error.',
        message: 'Cloudinary error.'
    },
    [AppErrorTypeEnum.NO_PAYLOAD_PROVIDED]: {
        type: AppErrorTypeEnum.NO_PAYLOAD_PROVIDED,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'No payload provided.',
        message: 'No payload provided.'
    },
    [AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_ENTROPY]: {
        type: AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_ENTROPY,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'Insufficient user password entropy.',
        message: 'Insufficient user password entropy.'
    },
    [AppErrorTypeEnum.INVALID_ORDER_STATUS]: {
        type: AppErrorTypeEnum.INVALID_ORDER_STATUS,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'Invalid order status.',
        message: 'Invalid order status.'
    },
    [AppErrorTypeEnum.INVALID_DATA]: {
        type: AppErrorTypeEnum.INVALID_DATA,
        httpStatus: HttpStatus.BAD_REQUEST,
        cause: 'Invalid data.',
        message: 'Invalid data.'
    }
}
