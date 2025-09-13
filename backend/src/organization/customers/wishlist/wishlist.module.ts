import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WishlistEntity } from 'common/entities/Wishlist.entity';
import { CustomerEntity } from 'common/entities/Customer.entity';

import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { ProductEntity } from 'common/entities/Product.entity';
import { WishlistItemEntity } from 'common/entities/WishlistItem.entity';
import { CartService } from '../cart/cart.service';
import { OrganizationEntity } from 'common/entities/Organization.entity';
import { ProductStockEntity } from 'common/entities/ProductStock.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WishlistEntity,
            CustomerEntity,
            OrganizationEntity,
            WishlistItemEntity,
            ProductStockEntity,
            ProductEntity
        ]),
        CartService
    ],
    controllers: [WishlistController],
    providers: [WishlistService],
    exports: [WishlistService]
})
export class WishlistModule {}
