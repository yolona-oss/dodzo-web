import { Module } from '@nestjs/common';
import { ImageUploadModule } from './../../../common/image-upload/image-upload.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'common/entities/Product.entity';
import { CategoryEntity } from 'common/entities/Category.entity';
import { SubCategoryEntity } from 'common/entities/Subcategory.entity';
import { ImageEntity } from 'common/entities/Image.entity';
import { ProductStockModule } from 'organization/stock/stock.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductEntity,
            CategoryEntity,
            SubCategoryEntity,
            ImageEntity
        ]),
        ProductStockModule,
        ReviewsModule,
        ImageUploadModule,
    ],
    providers: [ProductsService],
    controllers: [ProductsController],
    exports: [ProductsService]
})
export class ProductsModule {}
