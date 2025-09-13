import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from 'app.config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (config: AppConfig) => {
                console.log(config.database)
                return {
                    type: 'mariadb',
                    host: config.database.host,
                    port: parseInt(config.database.port),
                    username: config.database.user,
                    password: config.database.pass,
                    database: config.database.name,
                    entities: [__dirname + '/../entities/*.entity.{js,ts}'],
                    autoLoadEntities: false,        // automatically load entities from your project
                    synchronize: true,
                    logging: true,                 //
                }
            },
            inject: [AppConfig],
        })
    ]
})
export class DatabaseModule {}
