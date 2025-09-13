import { Res, Body, Controller, Post, NotImplementedException, Req, Get, UnauthorizedException, Query } from '@nestjs/common';
import { Request, Response } from 'express'

import { AuthService } from "./../services/auth.service";

import { ConfirmMailDto, JwtPayload, LoginCredentials, REFRESH_TOKEN, ResendConfirmMailDto } from '@dodzo-web/shared';
import { JwtAuthUser } from 'common/decorators/user.decorator';
import { CreateUserDto, extractToken } from '@dodzo-web/shared';
import { Role } from '@dodzo-web/shared';
import { RequiredRoles } from 'common/decorators/role.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    async login(
        @Body() {email, password}: LoginCredentials,
        @Req() request: Request,
        @Res() response: Response
    ) {
        const authResponse = await this.authService.login({email, password}, request, response)

        response.status(201).json(authResponse)
    }

    @Post('/signup')
    async signup(
        @Body() credentials: CreateUserDto,
        @Res() response: Response,
        @Req() request: Request
    ) {
        console.log(credentials)
        const authResponse = await this.authService.signup(credentials, request, response)

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

    @RequiredRoles(Role.User)
    @Post('/logout')
    async logout(
        @JwtAuthUser() user: JwtPayload,
        @Req() request: Request,
        @Res() response: Response
    ) {
        await this.authService.logout(user.id, request.cookies)

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

    @RequiredRoles(Role.User)
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
                throw new UnauthorizedException('Token not found');
            }
            return await this.authService.findAuthUserFromAccessToken(token);
        } catch (error) {
            console.debug(error);
            throw new UnauthorizedException();
        }
    }
}
