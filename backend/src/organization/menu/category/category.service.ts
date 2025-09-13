import { Injectable } from '@nestjs/common';

import { ImageUploadService } from './../../../common/image-upload/image-upload.service';

import { AppError, AppErrorTypeEnum } from './../../../common/app-error';

import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'common/entities/Category.entity';
import { Repository } from 'typeorm';
import { SubCategoryEntity } from 'common/entities/Subcategory.entity';
import {
    CreateCategoryDto,
    PaginatedResponseDto,
    PaginationDto,
    UpdateCategoryDto
} from '@dodzo-web/shared';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>,
        @InjectRepository(SubCategoryEntity)
        private readonly subCategoryRepo: Repository<SubCategoryEntity>,
        private readonly imageUploadService: ImageUploadService
    ) { }

    async findPaginated(opts: PaginationDto): Promise<PaginatedResponseDto<CategoryEntity>> {
        const offset = opts.offset ?? 1
        const limit = opts.limit ?? 10

        const totalRows = await this.categoryRepo.count()
        const totalPages = +Math.ceil(totalRows / (limit || 1))

        if (totalRows === 0) {
            return {
                data: [],
                pagination: { offset: 0, limit: 0 },
                overallCount: 0
            }
        }

        if (offset > totalPages) {
            throw new AppError(AppErrorTypeEnum.INVALID_RANGE)
        }

        const [entities, count] = await this.categoryRepo.findAndCount({
            relations: ['images', 'subCategories'],
            skip: (offset - 1) * limit,
            take: limit
        })

        return {
            data: entities,
            pagination: { offset, limit },
            overallCount: count
        }
    }

    async findAll() {
        return await this.categoryRepo.find()
    }

    async findById(id: string) {
        return await this.categoryRepo.findOne({
            where: { id },
            relations: ['images', 'subCategories']
        })
    }

    async create(dto: CreateCategoryDto) {
        const category_e = new CategoryEntity()
        category_e.name = dto.name

        if (!dto.imageId) {
            const blank_cat_image = await this.imageUploadService.findBlank("Category")
            if (!blank_cat_image) {
                throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE, {
                    message: `Cannot create category ${category_e.name} with blank image: blank image not found`
                })
            }
            category_e.image = [blank_cat_image]
        } else {
            const image_e = await this.imageUploadService.findById(dto.imageId)
            if (!image_e) {
                throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE, {
                    message: `Cannot create category ${category_e.name} with image ${dto.imageId}: image not found`
                })
            }
            category_e.image = [image_e]
        }

        return await this.categoryRepo.save(category_e)
    }

    async update(id: string, updateDto: UpdateCategoryDto): Promise<CategoryEntity> {
        const category_e = await this.categoryRepo.findOne({ where: { id } })

        if (!category_e) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE, { message: `Category with id ${id} not found` })
        }

        category_e.name = updateDto.name

        if (updateDto.imageId) {
            const image_e = await this.imageUploadService.findById(updateDto.imageId)
            if (!image_e) {
                throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE, {
                    message: `Cannot update category ${category_e.name} with image ${updateDto.imageId}: image not found`
                })
            }
            category_e.image = [image_e]
        }

        return await this.categoryRepo.save(category_e)
    }

    async removeByEntity(entity: CategoryEntity) {
        return await this.categoryRepo.remove(entity)
    }

    async removeById(id: string) {
        const cat_e = await this.findById(id)
        if (!cat_e) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_DELETE, { message: 'Category not found' })
        }
        return await this.removeByEntity(cat_e)
    }
}
