import { Injectable } from '@nestjs/common';

import { ImageUploadService } from './../../../common/image-upload/image-upload.service';

import { AppError, AppErrors, AppErrorTypeEnum } from './../../../common/app-error';

import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'common/entities/Product.entity';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import {
    CreateProductDto,
    CreateProductStockDto,
    PaginatedResponseDto,
    QueryProductDto,
    UpdateProductDto
} from '@dodzo-web/shared';
import { CategoryEntity } from 'common/entities/Category.entity';
import { SubCategoryEntity } from 'common/entities/Subcategory.entity';
import { ImageEntity } from 'common/entities/Image.entity';
import { DefaultImages, DefaultImagesType } from 'common/enums/default-images.enum';
import { ProductStockService } from 'organization/stock/services/stock.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,

        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>,

        @InjectRepository(SubCategoryEntity)
        private readonly subCategoryRepo: Repository<SubCategoryEntity>,

        @InjectRepository(ImageEntity)
        private readonly imageRepo: Repository<ImageEntity>,

        private readonly imageService: ImageUploadService,
        private readonly stockService: ProductStockService,
    ) { }

    async findById(id: string) {
        return await this.productRepo.findOne({
            where: { id },
            relations: {
                category: true,
                subCategory: true,
                images: true,
                primaryImage: true
            }
        })
    }

    async findAll(query: QueryProductDto): Promise<PaginatedResponseDto<ProductEntity>> {
        const { search, categoryId, subCategoryId, minPrice, maxPrice, offset, limit } = query;

        const qb: SelectQueryBuilder<ProductEntity> = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.subCategory', 'subCategory')
        .leftJoinAndSelect('product.images', 'images')
        .leftJoinAndSelect('product.reviews', 'reviews');

        if (search) {
            qb.andWhere('LOWER(product.name) LIKE LOWER(:search)', { search: `%${search}%` });
        }

        if (categoryId) {
            qb.andWhere('category.id = :categoryId', { categoryId });
        }

        if (subCategoryId) {
            qb.andWhere('subCategory.id = :subCategoryId', { subCategoryId });
        }

        if (minPrice !== undefined) {
            qb.andWhere('product.price >= :minPrice', { minPrice });
        }

        if (maxPrice !== undefined) {
            qb.andWhere('product.price <= :maxPrice', { maxPrice });
        }

        qb.skip((offset - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();

        return {
            data: items,
            pagination: {
                offset,
                limit,
            },
            overallCount: total
        };
    }

    async productsCount() {
        return await this.productRepo.count()
    }

    async create(dto: CreateProductDto) {
        const category_e = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
        if (!category_e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND, { message: `Cannot create product. Category with id ${dto.categoryId} not found` })
        }

        let subCategory_e: SubCategoryEntity|null
        if (dto.subCategoryId) {
            subCategory_e = await this.subCategoryRepo.findOneBy({ id: dto.subCategoryId });
            if (!subCategory_e) {
                throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND, { message: `Cannot create product. Subcategory with id ${dto.subCategoryId} not found` })
            }
        }

        const primaryImage_e = dto.primaryImageId
            ? await this.imageRepo.findOneBy({ id: dto.primaryImageId })
            : await this.imageService.findBlank(DefaultImages.Product as DefaultImagesType);

        const images_e = dto.imageIds?.length
            ? await this.imageRepo.find({ where: { id: In(dto.imageIds) } })
            : [];

        if (!primaryImage_e) {
            throw AppErrors.dbEntityNotFound('Primary image not found');
        }

        const product = this.productRepo.create({
            title: dto.title,
            description: dto.description,
            sku: dto.sku,
            price: dto.price,
            category: category_e,
            subCategory: subCategory_e!,
            primaryImage: primaryImage_e,
            images: images_e,
        });

        const saved = await this.productRepo.save(product);

        return saved
    }

    async update(id: string, dto: UpdateProductDto) {
        const product = await this.findById(id);

        if (!product) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                { message: `Cannot update product. Product with id ${id} not found` }
            )
        }

        if (dto.categoryId) {
            const category_e = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
            if (!category_e) {
                throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                    { message: `Cannot update product. Category with id ${dto.categoryId} not found` }
                )
            }
            product.category = category_e;
        }

        if (dto.subCategoryId) {
            const subCategory = await this.subCategoryRepo.findOne({ where: { id: dto.subCategoryId } });
            if (!subCategory) {
                throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                    { message: `Cannot update product. Subcategory with id ${dto.subCategoryId} not found` }
                )
            }
            product.subCategory = subCategory;
        }
        if (dto.primaryImageId) {
            const primaryImage = await this.imageRepo.findOneBy({ id: dto.primaryImageId });
            if (!primaryImage) {
                throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                    { message: `Cannot update product. Image with id ${dto.primaryImageId} not found` }
                )
            }
            product.primaryImage = primaryImage;
        }

        if (dto.imageIds) {
            const images = await this.imageRepo.find({ where: { id: In(dto.imageIds) } });
            product.images = images;
        }

        Object.assign(product, dto);
        return this.productRepo.save(product);
    }

    async remove(id: string) {
        const product = await this.findById(id);
        if (!product) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                { message: `Cannot remove product. Product with id ${id} not found` }
            )
        }
        return this.productRepo.remove(product);
    }
}
