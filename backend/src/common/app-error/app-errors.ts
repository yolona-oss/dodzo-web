import { createAppError } from "./app-error-factory";
import { AppErrorTypeEnum } from "./enums/app-error-type.enum";

export const AppErrors = {
    badRequest: (msg?: string) =>
        createAppError(AppErrorTypeEnum.BAD_REQUEST, msg),

    dbCannotRead: (msg?: string) =>
        createAppError(AppErrorTypeEnum.DB_CANNOT_READ, msg),

    dbCannotCreate: (msg?: string) =>
        createAppError(AppErrorTypeEnum.DB_CANNOT_CREATE, msg),

    dbCannotDelete: (msg?: string) =>
        createAppError(AppErrorTypeEnum.DB_CANNOT_DELETE, msg),

    dbCannotUpdate: (msg?: string) =>
        createAppError(AppErrorTypeEnum.DB_CANNOT_UPDATE, msg),

    dbEntityExists: (msg?: string) =>
        createAppError(AppErrorTypeEnum.DB_ENTITY_EXISTS, msg),

    dbEntityNotFound: (msg?: string) =>
        createAppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND, msg),

    dbNothingToUpdate: (msg?: string) =>
        createAppError(AppErrorTypeEnum.DB_NOTHING_TO_UPDATE, msg),

    invalidData: (msg?: string) =>
        createAppError(AppErrorTypeEnum.INVALID_DATA, msg),

    invalidObjectId: (msg?: string) =>
        createAppError(AppErrorTypeEnum.INVALID_OBJECT_ID, msg),

    invalidRange: (msg?: string) =>
        createAppError(AppErrorTypeEnum.INVALID_RANGE, msg),

    duplicateKey: (msg?: string) =>
        createAppError(AppErrorTypeEnum.DUPLICATE_KEY, msg),

    validationError: (msg?: string) =>
        createAppError(AppErrorTypeEnum.VALIDATION_ERROR, msg),

    invalidOrderStatus: (msg?: string) =>
        createAppError(AppErrorTypeEnum.INVALID_ORDER_STATUS, msg),

    dbIncorrectModel: (msg?: string) =>
        createAppError(AppErrorTypeEnum.DB_INCORRECT_MODEL, msg),

    cannotUploadImage: (msg?: string) =>
        createAppError(AppErrorTypeEnum.CANNOT_UPLOAD_IMAGE, msg),

    imageNotUploaded: (msg?: string) =>
        createAppError(AppErrorTypeEnum.IMAGE_NOT_UPLOADED, msg),

    cloudinaryError: (msg?: string) =>
        createAppError(AppErrorTypeEnum.CLOUDINARY_ERROR, msg),

    roleAlreadyProvided: (msg?: string) =>
        createAppError(AppErrorTypeEnum.ROLE_ALREADY_PROVIDED, msg),

    insufficientUserPasswordLength: (msg?: string) =>
        createAppError(AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_LENGTH, msg),

    insufficientUserPasswordEntropy: (msg?: string) =>
        createAppError(AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_ENTROPY, msg),

    invalidCredentials: (msg?: string) =>
        createAppError(AppErrorTypeEnum.INVALID_CREDENTIALS_EXCEPTION, msg),

    emailNotVerified: (msg?: string) =>
        createAppError(AppErrorTypeEnum.EMAIL_NOT_VERIFIED_EXCEPTION, msg),

    roleNotProvided: (msg?: string) =>
        createAppError(AppErrorTypeEnum.ROLE_NOT_PROVIDED, msg),

    noPayloadProvided: (msg?: string) =>
        createAppError(AppErrorTypeEnum.NO_PAYLOAD_PROVIDED, msg),
};
