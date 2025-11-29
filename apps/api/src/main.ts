import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';

import { GlobalExceptionFilter } from './common/filters/global.filter';

import { corsOptions } from './config/cors.config';
import { helmetOptions } from './config/helmet.config';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        rawBody: true,
        bufferLogs: true
    });

    // app.useGlobalPipes(
    //     new ValidationPipe({
    //         whitelist: true,
    //         transform: true,
    //         forbidNonWhitelisted: true,
    //         transformOptions: {
    //             enableImplicitConversion: true,
    //         },
    //     }),
    // );

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    app.use(cookieParser())
    app.use(helmet(helmetOptions))
    app.use(compression())
    app.setGlobalPrefix('api')
    app.useGlobalFilters(new GlobalExceptionFilter())
    // app.enableCors(corsOptions)
    // app.enableShutdownHooks(['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGKILL'])

    // app.useBodyParser('json', { limit: '5mb' });
    // app.use(json({ limit: '50mb' }));
    // app.use(urlencoded({ limit: '50mb', extended: true }));

    const swaggerConfig = new DocumentBuilder()
    .setTitle('docs title')
    .setDescription('docs decription')
    .setVersion('1.0')
    .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('doc', app, document);

    const port = process.env.PORT || 4000
    app.listen(port,
        async () => {
            console.log(`Application is running on: ${await app.getUrl()}`);
        });
}

bootstrap();
