import { AppConfigModule } from './app.config';
import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';

import { ServeStaticModule } from '@nestjs/serve-static';

import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { OrganizationModule } from './organization/org.module';
import { JwtGuard } from './common/guards/jwt.guard';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';

import { join } from 'path';

console.log("Images path: ", join(__dirname, '..', '..', 'images'))

@Module({
    imports: [
        AppConfigModule,
        CommonModule,
        UserModule,
        OrganizationModule,
        JwtModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'images'),
            serveRoot: '/images'
        }),
        ThrottlerModule.forRoot([{
            ttl: 15 * 60 * 1000,
            limit: 100
        }]),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
    ],
})
export class AppModule {
    // configure(consumer: MiddlewareConsumer) {
    //   consumer
    //     .apply(AuthMiddleware)
    //     .exclude(...['auth'].map((route) => `/v1/${route}/*path`))
    //     .forRoutes('*');
    // }
}
