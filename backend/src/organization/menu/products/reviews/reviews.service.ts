import { Injectable } from '@nestjs/common';

import { AppError, AppErrorTypeEnum } from './../../../../common/app-error';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReviewEntity } from 'common/entities/ProductReview.entity';
import { Repository } from 'typeorm';
import { CustomerEntity } from 'common/entities/Customer.entity';
import { CreateProductReviewDto, PaginatedResponseDto, PaginationDto } from '@dodzo-web/shared';
import { ProductEntity } from 'common/entities/Product.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(ProductReviewEntity)
        private readonly pReviewsRepo: Repository<ProductReviewEntity>,
        @InjectRepository(CustomerEntity)
        private readonly customerRepo: Repository<CustomerEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>
    ) { }

    async findAll() {
        return await this.pReviewsRepo.find({
            relations: {
                product: true,
                customer: true
            }
        })
    }

    async findById(id: string) {
        return await this.pReviewsRepo.findOne({
            where: { id },
            relations: {
                product: true,
                customer: true
            }
        })
    }

    async findCustomerReviews(customerId: string, pagination: PaginationDto = { offset: 1, limit: 10 }): Promise<PaginatedResponseDto<ProductReviewEntity>> {
        const customer_e = await this.customerRepo.findOne({where: {id: customerId }})
        if (!customer_e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                { message: `Customer with id ${customerId} not found` }
            )
        }

        const offset = pagination.offset || 1
        const limit = pagination.limit || 10

        const [enities, overallCount] = await this.pReviewsRepo.findAndCount({
            where: {
                customer: customer_e
            },
            relations: {
                product: true,
                customer: true
            },
            skip: (offset - 1) * limit,
            take: limit
        })

        return {
            data: enities,
            pagination: {
                offset,
                limit
            },
            overallCount
        }
    }

    async findProductReviews(productId: string, pagination: PaginationDto = { offset: 1, limit: 10 }): Promise<PaginatedResponseDto<ProductReviewEntity>> {
        const product_e = await this.productRepo.findOne({where: {id: productId }})
        if (!product_e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                { message: `Product with id ${productId} not found` }
            )
        }

        const offset = pagination.offset || 1
        const limit = pagination.limit || 10

        const [enities, overallCount] = await this.pReviewsRepo.findAndCount({
            where: {
                product: product_e
            },
            relations: {
                product: true,
                customer: true
            },
            skip: (offset - 1) * limit,
            take: limit
        })

        return {
            data: enities,
            pagination: { offset, limit },
            overallCount
        }
    }

    // more verify
    async create(dto: CreateProductReviewDto) {
        const product_e = await this.productRepo.findOne({where: {id: dto.productId }});
        const customer_e = await this.customerRepo.findOne({where: {id: dto.customerId }});

        if (!product_e || !customer_e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                { message: `Cannot create review. Product with id ${dto.productId} or customer with id ${dto.customerId} not found` }
            )
        }

        const review = this.pReviewsRepo.create({
            ...dto,
            product: product_e,
            customer: customer_e
        })

        return await this.pReviewsRepo.save(review)
    }
}
