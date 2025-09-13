import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { REQUSET_USER_KEY } from './../../common/constants';

import { IS_PUBLIC_KEY } from './../../common/decorators/public.decorotor';
import { ROLES_KEY } from './../../common/decorators/role.decorator';

import { JwtPayload, Role } from '@dodzo-web/shared';
import { extractToken } from '@dodzo-web/shared';
import { AppConfig } from 'app.config';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly config: AppConfig
    ) { }

    canActivate(
        context: ExecutionContext,
    ): Promise<boolean> | Observable<boolean> | boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true
        }

        const request = context.switchToHttp().getRequest();
        const token = extractToken(request);
        if (!token) {
            throw new UnauthorizedException("Authentication token not found.");
        }

        try {
            const payload: JwtPayload = this.jwtService.verify(token, {
                publicKey: Buffer.from(this.config.jwt.access_token.public_key, 'base64').toString('utf-8')
            })
            request[REQUSET_USER_KEY] = payload;
            return requiredRoles.some((role) => payload.roles.includes(role))
        } catch (error: any) {
            // console.error('Token validation failed. ', error)
            throw new UnauthorizedException("Token validation failed. ", error);
        }
    }
}
