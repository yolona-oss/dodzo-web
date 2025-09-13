import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, CookieOptions, Response } from 'express';

import { CustomerEntity } from 'common/entities/Customer.entity';

import { AppConfig } from 'app.config';
import { UserService } from './user.service';
import { UserEntity } from 'common/entities/User.entity';

import { EmailService } from 'common/email/email';

import Crypto from './crypto-service';
import crypto from 'crypto'
import { AppError, AppErrorTypeEnum } from './../../common/app-error';

import { DEFAULT_USER_ROLE } from 'common/constants/default-user-role';
import { JwtPayload, JwtRefreshPayload, Role } from '@dodzo-web/shared';

import {
    REFRESH_TOKEN,
    getHostUrl,
    // extractDomain,
    // isHttps,
    LoginCredentials,
    CreateUserDto,
    IAuthSession,
    IAuthUser,
    IRefreshToken,
    IAccessToken,
    toAuthUser,
} from '@dodzo-web/shared';
import { GenerateAccessTokenParams } from 'user/interfaces/generate-access-token.interface';
import { GenerateRefreshTokenParams } from 'user/interfaces/generate-refresh-token';
import { GenerateTokensParams } from 'user/interfaces/generate-tokens.interface';
import { CustomersService } from 'organization/customers/customers.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(CustomerEntity)
        private readonly customerRepo: Repository<CustomerEntity>,

        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly customerService: CustomersService,
        private readonly config: AppConfig
    ) { }

    async login({ email, password }: LoginCredentials, request: Request, response: Response): Promise<IAuthSession> {
        const user = await this.validateUser(email, password)
        const customerId = await this.getUserCustomerId(user.id)

        const { access_token, refresh_token } = await this.generateTokens({
            userId: user.id,
            customerId,
            email: user.email,
            roles: <Role[]>user.roles
        })

        this.setRefreshTokenCookie(request, response, refresh_token)

        return {
            access_token,
            user: toAuthUser(user)
        }
    }

    // TODO handle user removal if error occurend in next steps
    async signup(dto: CreateUserDto, request: Request, response: Response): Promise<IAuthSession> {
        // verification of fields is done in users service
        const newUser = await this.userService.create(dto)
        const customerId = await this.getUserCustomerId(newUser.id)

        await this.sendEmailConfirmation(newUser);

        const { access_token, refresh_token } = await this.generateTokens({
            userId: newUser.id,
            customerId,
            email: newUser.email,
            roles: [DEFAULT_USER_ROLE]
        })

        this.setRefreshTokenCookie(request, response, refresh_token)

        return {
            access_token,
            user: toAuthUser(newUser)
        }
    }

    async sendEmailConfirmation(user: UserEntity) {
        const token = this.jwtService.sign(
            {
                sub: user.id,
                email: user.email
            },
            {
                expiresIn: this.config.jwt.email_confirmation.sign_options.expires_in,
                privateKey: Buffer.from(this.config.jwt.email_confirmation.private_key, 'base64').toString('utf-8'),
            })

        const url = `${this.config.frontendUrl}/auth/confirm-email?token=${token}`

        // just use some html templater and compiler lol
        const conf = {
            to: user.email,
            from: this.config.email.from,
            subject: 'Email confirmation',
            text: `Please confirm your email by clicking ${url}`,
            html: `Please confirm your email by clicking <a href="${url}">here</a>`,
        }
        await EmailService.getInstance().sendMail(conf)
    }

    async resendConfirmEmailToken(email: string) {
        const user = await this.userService.findByEmail(email)
        if (!user) {
            throw new AppError(AppErrorTypeEnum.DB_NOTHING_TO_UPDATE, { message: "User not found" })
        }
        if (user.emailVerified) {
            throw new AppError(AppErrorTypeEnum.DB_NOTHING_TO_UPDATE, { message: "Email already confirmed" })
        }
        await this.sendEmailConfirmation(user);
    }

    async confirmEmail(token: string) {
        try {
            const payload = this.jwtService.verify(token, {
                publicKey: Buffer.from(this.config.jwt.email_confirmation.public_key, 'base64').toString('utf-8')
            });

            await this.userService.confirmEmail(payload.sub);
            return { message: 'Email confirmed successfully' };
        } catch (err: any) {
            console.error(err)
            throw new UnauthorizedException('Invalid email confirm token');
        }
    }

    async logout(userId: string, cookies: any) {
        const refresToken = cookies[REFRESH_TOKEN.cookie.name]

        const rTknHash = Crypto.createTokenHash(refresToken)

        await this.userService.removeToken(userId, rTknHash)

        return
    }
    async refreshAccessToken(request: Request, response: Response): Promise<IAccessToken> {
        try {
            const refreshToken = request.cookies[REFRESH_TOKEN.cookie.name];

            if (!refreshToken) {
                throw new UnauthorizedException('Refresh token not found')
            }

            const rTknPayload = this.jwtService.verify<JwtRefreshPayload>(
                refreshToken,
                { publicKey: Buffer.from(this.config.jwt.refresh_token.public_key, 'base64').toString('utf-8') }
            );
            const rTknHash = Crypto.createTokenHash(refreshToken)

            // Check if refresh token is valid and contains valid user id
            const user = await this.userService.findByAssignedToken(rTknPayload.id, rTknHash);
            if (!user) {
                throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND, { message: 'User not found' })
            }
            const customerId = await this.getUserCustomerId(user.id)

            const newATkn = this.generateAccessToken({
                customerId,
                userId: user.id,
                email: user.email,
                roles: <Role[]>user.roles
            });
            const { refresh_token } = await this.generateRefreshToken({ userId: user.id });

            this.setRefreshTokenCookie(request, response, refresh_token);

            return {
                access_token: newATkn.access_token,
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError()
        }
    }

    /***
    * @returns customer id (existed or created)
    */
    private async getUserCustomerId(userId: string): Promise<string> {
        let customer = await this.customerRepo.findOne({
            where: { user: { id: userId } },
            select: { id: true }
        })
        if (!customer) {
            customer = await this.customerService.create({userId, deliveryAddressId: undefined})
        }

        return customer.id
    }

    async validateUser(email: string, pass: string): Promise<UserEntity> {
        const user = await this.userService.findByEmail(email);
        if (!user || !Crypto.comparePasswords(pass, user.password)) {
            throw new AppError(AppErrorTypeEnum.INVALID_CREDENTIALS_EXCEPTION)
        }
        return user;
    }

    private createRefreshTokenCookie(request: Request): {
        name: string;
        options: CookieOptions;
    } | null {
        const url = getHostUrl(request.headers);
        // console.debug(`Begin creating cookie for URL: ${url}`);

        if (!url) {
            return null;
        }

        // const domain = extractDomain(url) ?? undefined;
        // const useSecureCookies = isHttps(request.headers);
        // console.debug(`Constructed domain for cookie: ${domain}`);

        return {
            name: REFRESH_TOKEN.cookie.name,
            options: {
                ...REFRESH_TOKEN.cookie.options,
                // expires: REFRESH_TOKEN.cookie.options.expires,
                // httpOnly: true,
                // sameSite: 'lax',
                // secure: useSecureCookies,
                // ...(useSecureCookies ? { domain } : null)
            }
        };
    }

    private setRefreshTokenCookie(request: Request, response: Response, refreshToken: string): void {
        const cookie = this.createRefreshTokenCookie(request);
        if (!cookie) {
            throw new UnauthorizedException('You are unauthenticated!')
        }
        response.cookie(cookie.name, refreshToken, cookie.options);
    }

    async findAuthUserFromAccessToken(token: string): Promise<IAuthUser> {
        const decode = this.jwtService.verify(token,
            {
                publicKey: Buffer.from(
                    this.config.jwt.access_token.public_key,
                    'base64'
                ).toString('utf-8')
            }
        )

        if (!decode.sub) {
            console.error('No profile identifier found in session payload');
            throw new UnauthorizedException();
        }

        const user = await this.userService.findById(decode.sub);

        if (!user) {
            console.error('User not found');
            throw new UnauthorizedException();
        }

        return toAuthUser(user);
    }

    private generateAccessToken(params: GenerateAccessTokenParams): IAccessToken {
        const { userId, email, customerId, roles } = params
        const access_token_payload: JwtPayload = {
            id: userId,
            sub: userId,
            email,
            customerId,
            roles
        }
        const access_token = this.jwtService.sign(access_token_payload)

        return { access_token }
    }

    private async generateRefreshToken(params: GenerateRefreshTokenParams): Promise<IRefreshToken> {
        const { userId } = params
        const refresh_token = this.jwtService.sign(
            {
                sub: userId.toString(),
                id: userId.toString(),
            },
            {
                expiresIn: this.config.jwt.refresh_token.sign_options.expires_in,
                privateKey: Buffer.from(this.config.jwt.refresh_token.private_key, 'base64').toString('utf-8')
            }
        )

        const rTknHash = Crypto.createTokenHash(refresh_token)

        await this.userService.addToken(userId, rTknHash);
        return {
            refresh_token
        }
    }

    private async generateTokens(params: GenerateTokensParams): Promise<IRefreshToken & IAccessToken> {
        const { access_token } = this.generateAccessToken(params)
        const { refresh_token } = await this.generateRefreshToken({userId: params.userId})
        return {
            access_token,
            refresh_token
        }
    }

    async generageResetToken(userId: string): Promise<string> {
        const resetTokenValue = crypto.randomBytes(20).toString("base64url");
        const resetTokenSecret = crypto.randomBytes(10).toString("hex");

        // Separator of `+` because generated base64url characters doesn't include this character
        const resetToken = `${resetTokenValue}+${resetTokenSecret}`;

        const resetTokenHash = crypto
        .createHmac("sha256", resetTokenSecret)
        .update(resetTokenValue)
        .digest("hex");

        try {
            await this.userService.addResetToken(userId, resetTokenHash);
        } catch (error: any) {
            throw new UnauthorizedException('You are unauthenticated!')
        }

        return resetToken;
    }
}
