import { Module } from '@nestjs/common';

import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { CartModule } from '../cart/cart.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'common/entities/Order.entity';
import { OrderItemEntity } from 'common/entities/OrderItem.entity';
import { CustomerEntity } from 'common/entities/Customer.entity';
import { AddressBookEntity } from 'common/entities/AddressBook.entity';
import { OrganizationEntity } from 'common/entities/Organization.entity';
import { ProductStockModule } from 'organization/stock/stock.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity,
            OrderItemEntity,
            CustomerEntity,
            AddressBookEntity,
            OrganizationEntity,
        ]),
        CartModule,
        ProductStockModule,
    ],
    providers: [OrderService],
    controllers: [OrderController],
    exports: [OrderService]
})
export class OrderModule {}
