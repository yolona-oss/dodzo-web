import { AppError } from './app-error';
import { AppErrorTypeEnum } from './enums/app-error-type.enum';

export function createAppError(
    type: AppErrorTypeEnum,
    message?: string
): AppError {
    return new AppError(type, message ? { message } : undefined);
}
