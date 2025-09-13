import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

import { CustomerEntity } from 'common/entities/Customer.entity';
import { CartEntity } from 'common/entities/Cart.entity';
import { OrderEntity } from 'common/entities/Order.entity';
import { WishlistEntity } from 'common/entities/Wishlist.entity';
import { AddressBookEntity } from 'common/entities/AddressBook.entity';
import { UserEntity } from 'common/entities/User.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CustomerEntity,
            CartEntity,
            OrderEntity,
            UserEntity,
            WishlistEntity,
            AddressBookEntity
        ])
    ],
    providers: [CustomersService],
    controllers: [CustomersController],
    exports: [CustomersService]
})
export class CustomersModule {}
