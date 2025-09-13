import { Module } from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReviewEntity } from 'common/entities/ProductReview.entity';
import { CustomerEntity } from 'common/entities/Customer.entity';
import { ProductEntity } from 'common/entities/Product.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductReviewEntity, CustomerEntity, ProductEntity
        ])
    ],
    providers: [ReviewsService],
    exports: [ReviewsService],
})
export class ReviewsModule {}
