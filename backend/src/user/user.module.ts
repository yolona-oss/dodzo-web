import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from 'app.config';

import { ImageUploadModule } from './../common/image-upload/image-upload.module';

import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

import { UsersController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';

import { CustomersModule } from 'organization/customers/customers.module';

import { UserEntity } from 'common/entities/User.entity';
import { AddressBookEntity } from 'common/entities/AddressBook.entity';
import { CartEntity } from 'common/entities/Cart.entity';
import { OrderEntity } from 'common/entities/Order.entity';
import { WishlistEntity } from 'common/entities/Wishlist.entity';
import { ProductReviewEntity } from 'common/entities/ProductReview.entity';
import { ImageEntity } from 'common/entities/Image.entity';
import { CustomerEntity } from 'common/entities/Customer.entity';

@Module({
    controllers: [
        UsersController,
        AuthController
    ],
    providers: [
        UserService,
        AuthService
    ],
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            CartEntity,
            OrderEntity,
            WishlistEntity,
            AddressBookEntity,
            ProductReviewEntity,
            CustomerEntity,
            ImageEntity,
        ]),
        JwtModule.registerAsync({
            inject: [AppConfig],
            useFactory: (config: AppConfig) => ({
                privateKey: Buffer.from(config.jwt.access_token.private_key, 'base64').toString('utf-8'),
                publicKey: Buffer.from(config.jwt.access_token.public_key, 'base64').toString('utf-8'),
                signOptions: {
                    expiresIn: config.jwt.access_token.sign_options.expires_in,
                    algorithm: config.jwt.algorithm
                },
            })
        }),
        CustomersModule,
        ImageUploadModule
    ],
    exports: [UserService]
})
export class UserModule implements OnApplicationBootstrap {
    constructor(
        private userService: UserService,
        private config: AppConfig
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        await this.userService.__createDefaultAdmin({
            username: this.config.defaultUser.name,
            email: this.config.defaultUser.email,
            phone: this.config.defaultUser.phone,
            password: this.config.defaultUser.password
        })
    }
}
