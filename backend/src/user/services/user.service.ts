import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'common/entities/User.entity';

import { ImageUploadService } from './../../common/image-upload/image-upload.service';

import { AppErrors } from './../../common/app-error';
import { DeepPartial } from './../../common/types/deep-partial.type';
import Crypto from './../services/crypto-service'

import {
    CreateUserDto,
    UpdateUserDto,
    Role,
    MIN_USER_PASSWORD_LENGTH,
    MAX_USER_PASSWORD_LENGTH,
    MIN_USER_PASSWORD_ENTROPY,
    PaginationDto,
    PaginatedResponseDto,
} from '@dodzo-web/shared';

import { Writeable } from './../../common/types/writable.type';
import { DefaultImages, DefaultImagesType } from 'common/enums/default-images.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly imagesService: ImageUploadService
    ) { }

    async findAll(dto: PaginationDto): Promise<PaginatedResponseDto<UserEntity>> {
        const offset = dto.offset ?? 1
        const limit = dto.limit ?? 10

        const [entities, overallCount] = await this.userRepo.findAndCount({
            skip: (offset - 1) * limit,
            take: limit,
        })

        return {
            data: entities,
            overallCount,
            pagination: {
                offset,
                limit
            }
        }
    }

    async findById(id: string): Promise<UserEntity | null> {
        return await this.userRepo.findOne({ where: { id } })
    }

    async findByPhone(phone: string): Promise<UserEntity | null> {
        return await this.userRepo.findOne({ where: { phone: phone }})
    }

    async findByEmail(email: string): Promise<UserEntity | null>  {
        return await this.userRepo.findOne({ where: { email } })
    }

    async findByAssignedToken(userId: string, token: string): Promise<UserEntity | null> {
        const user = await this.userRepo.findOne({ where: { id: userId }})

        if (!user) {
            return null
        }

        if (user.tokens.indexOf(token) === -1) {
            return null
        }

        return user
    }

    async addToken(userId: string, token: string): Promise<UserEntity> {
        const user = await this.findById(userId)
        if (!user) {
            throw AppErrors.dbEntityNotFound('User not found')
        }
        user.tokens.push(token)

        return await this.userRepo.save(user)
    }

    async removeToken(userId: string, token: string) {
        const res = await this.userRepo
            .createQueryBuilder("user")
            .update(UserEntity)
            .set({
                tokens: () =>
                    `TRIM(BOTH ',' FROM REPLACE(CONCAT(',', tokens, ','), CONCAT(',', :token, ','), ','))`
            })
            .where("id = :id", { id: userId })
            .setParameter("token", token)
            .execute();

        if (res.affected === 0) {
            throw AppErrors.dbEntityNotFound('User not found')
        }
    }

    async addResetToken(userId: string, token: string) {
        const res = await this.userRepo.update({ id: userId }, { resetPasswordToken: token })
        if (res.affected === 0) {
            throw AppErrors.dbEntityNotFound('User not found')
        }
    }

    async dropTokens(userId: string) {
        const res = await this.userRepo.update({ id: userId }, { tokens: [] })
        if (res.affected === 0) {
            throw AppErrors.dbEntityNotFound('User not found')
        }
    }

    async create(userData: CreateUserDto) {
        return await this.create_roleWrap(userData)
    }

    private async create_roleWrap(userData: CreateUserDto, provideRoles: Role[] = [Role.User]) {
        const isDuplicate = Boolean(await this.findByEmail(userData.email))
        const isPhoneDuplicate = userData.phone ? await this.findByPhone(userData.phone) : false
        if (isDuplicate || isPhoneDuplicate) {
            throw AppErrors.dbEntityExists('User already exists')
        }

        this.checkPasswordStrenth(userData.password)

        const default_avatar_e = await this.imagesService.findBlank(DefaultImages.User as DefaultImagesType)

        const passwordHash = Crypto.createPasswordHash(userData.password)
        const user = this.userRepo.create({
            ...userData,
            password: passwordHash,
            emailVerified: false,
            tokens: [],
            images: default_avatar_e ? [default_avatar_e] : [],
            roles: provideRoles
        })

        return await this.userRepo.save(user)
    }

    async remove(id: string) {
        const res = await this.userRepo.delete({ id })
        if (res.affected === 0) {
            throw AppErrors.dbEntityNotFound('User not found')
        }
    }

    async updateSafe(id: string, _newUserInfo: DeepPartial<UpdateUserDto>, currentPassword?: string) {
        const user = await this.findById(id)
        if (!user) {
            throw AppErrors.dbEntityNotFound('User not found')
        }

        let newUserInfo: DeepPartial<Writeable<UpdateUserDto>> = _newUserInfo
        if (Object.keys(newUserInfo).length == 0) {
            throw AppErrors.dbNothingToUpdate('Nothing to update')
        }

        if (currentPassword) {
            if (!Crypto.comparePasswords(currentPassword, user.password)) {
                throw new UnauthorizedException("Cannot update without passing user password")
            }
        }

        if (newUserInfo.password) {
            if (currentPassword && (currentPassword !== newUserInfo.password)) {
                newUserInfo.password = Crypto.createPasswordHash(newUserInfo.password)
            } else {
                throw AppErrors.badRequest("Cannot update password without passing current password")
            }
        }

        return await this.userRepo.update({ id }, newUserInfo)
    }

    async changePassword(id: string, currentPassword: string, newPassword: string) {
        await this.updateSafe(id,
            { password: newPassword },
            currentPassword)
    }

    async confirmEmail(id: string) {
        const res = await this.userRepo.update({ id } , { emailVerified: true })
        if (res.affected === 0) {
            throw AppErrors.dbEntityNotFound('User not found')
        }
    }

    async addRole(id: string, role: Role) {
        const user_e = await this.findById(id)
        if (!user_e) {
            throw AppErrors.dbEntityNotFound('User not found')
        }
        const currentRoles = user_e.roles

        if (currentRoles.includes(role)) {
            throw AppErrors.dbNothingToUpdate('User already has this role')
        }

        user_e.roles = [...currentRoles, role]

        return await this.userRepo.save(user_e)
    }

    async removeRole(id: string, role: Role) {
        const user_e = await this.findById(id)
        if (!user_e) {
            throw AppErrors.dbEntityNotFound('User not found')
        }
        const currentRoles = user_e.roles

        if (!currentRoles.includes(role)) {
            throw AppErrors.dbNothingToUpdate('User does not have this role')
        }

        user_e.roles = currentRoles.filter(r => r !== role)

        return await this.userRepo.save(user_e)
    }

    private checkPasswordStrenth(password: string) {
        if (password.length < MIN_USER_PASSWORD_LENGTH) {
            throw AppErrors.insufficientUserPasswordLength("Insufficient user password length. Must be at least " + MIN_USER_PASSWORD_LENGTH + " characters.")
        } else if (password.length >= MAX_USER_PASSWORD_LENGTH) {
            throw AppErrors.insufficientUserPasswordLength("Insufficient user password length. Must be less than " + MAX_USER_PASSWORD_LENGTH + " characters.")
        } else if (Crypto.calculateEntropy(password).entropy < MIN_USER_PASSWORD_ENTROPY) {
            throw AppErrors.insufficientUserPasswordEntropy("Insufficient user password entropy. Must be at least " + MIN_USER_PASSWORD_ENTROPY + " bits.")
        }
    }

    async __createDefaultAdmin(user: CreateUserDto) {
        const defaultUser = await this.findByEmail(user.email)
        if (!defaultUser) {
            await this.create_roleWrap(user, [Role.Admin, Role.User])
        }
    }
}
