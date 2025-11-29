import { Res, Body, Controller, Post, NotImplementedException, Req, Get } from '@nestjs/common';
import { Request, Response } from 'express'

import { AuthService } from "./../services/auth.service";

import {
    __RoleAll,
    REFRESH_TOKEN,
    ConfirmMailDto,
    LoginCredentials,
    ResendConfirmMailDto,
    CreateUserDto,
    extractToken
} from '@dodzo-web/shared';
import { RequiredRoles } from 'common/decorators/role.decorator';
import { AppErrors } from 'common/error';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    async login(
        @Body() credentials: LoginCredentials,
        @Req() request: Request,
        @Res() response: Response
    ) {
        console.log("login")
        const authResponse = await this.authService.login(credentials, request, response)

        response.status(201).json(authResponse)
    }

    @Post('/signup')
    async signup(
        @Body() credentials: CreateUserDto,
        @Res() response: Response,
        @Req() request: Request
    ) {
        console.log(credentials)
        const authResponse = await this.authService.register(credentials, request, response)

        response.status(201).json(authResponse)
    }

    @Post('/confirm-email')
    async confirmEmail(
        @Res() response: Response,
        @Body() dto: ConfirmMailDto
    ) {
        const res = await this.authService.confirmEmail(dto.token)

        response.status(200).json(res)
    }

    @Post('/resend-confirmation')
    async resendConfirmation(
        @Body() dto: ResendConfirmMailDto,
        @Res() response: Response
    ) {
        await this.authService.resendConfirmEmailToken(dto.email)

        response.status(200).json({
            message: "Email sent successfully"
        })
    }

    @Post('/refresh')
    async refreshAccessToken(
        @Req() request: Request,
        @Res() response: Response,
    ) {
        const token = await this.authService.refreshAccessToken(request, response)

        return response
            .status(201)
            .set({
                "Cache-Control": "no-store",
                Pragma: "no-cache"
            }).json(token)
    }

    @RequiredRoles(...__RoleAll)
    @Post('/logout')
    async logout(
        @Req() request: Request,
        @Res() response: Response
    ) {
        await this.authService.logout(request.cookies)

        const expireCookieOptions = Object.assign(
            {},
            REFRESH_TOKEN.cookie.options,
            {
                expires: new Date(1),
            }
        );

        return response
            .cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions)
            .status(205)
            .json({})
    }

    @RequiredRoles(...__RoleAll)
    @Post('/master-logout')
    async logoutAll() {
        throw new NotImplementedException()
    }

    @Post('/forgot-password')
    async forgotPassword() {
        throw new NotImplementedException()
    }

    @Post('/reset-password')
    async resetPassword() {
        throw new NotImplementedException()
    }

    @Get('session')
    async findSessionUser(@Req() request: Request) {
        try {
            const token = extractToken(request);
            if (!token) {
                throw AppErrors.unauthorized('Token not found');
            }
            return await this.authService.findUserByAccessToken(token.accessToken!);
        } catch (error: any) {
            console.debug(error);
            throw AppErrors.unauthorized(error?.message);
        }
    }
}
