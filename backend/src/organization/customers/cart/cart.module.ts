import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartService } from './cart.service';
import { CartController } from './cart.controller';

import { CartEntity } from 'common/entities/Cart.entity';
import { CartItemEntity } from 'common/entities/CartItem.entity';
import { ProductEntity } from 'common/entities/Product.entity';
import { CustomerEntity } from 'common/entities/Customer.entity';
import { ProductStockEntity } from 'common/entities/ProductStock.entity';
import { OrganizationEntity } from 'common/entities/Organization.entity';
import { ProductStockModule } from 'organization/stock/stock.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CartEntity,
            CartItemEntity,
            ProductEntity,
            CustomerEntity,
            ProductStockEntity,
            OrganizationEntity,
            ProductStockModule
        ])
    ],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService]
})
export class CartModule {}
