import { Injectable } from '@nestjs/common';

import { AppError, AppErrorTypeEnum } from './../../../common/app-error';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategoryEntity } from 'common/entities/Subcategory.entity';
import { Repository } from 'typeorm';
import { CategoryEntity } from 'common/entities/Category.entity';
import { CreateSubCategoryDto, PaginatedResponseDto, PaginationDto, UpdateSubCategoryDto } from '@dodzo-web/shared';

@Injectable()
export class SubCategoryService {
    constructor(
        @InjectRepository(SubCategoryEntity)
        private readonly subCategoryRepo: Repository<SubCategoryEntity>,
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>
    ) { }

    async findAll() {
        return await this.subCategoryRepo.find({ relations: ['category'] })
    }

    async findById(id: string) {
        return await this.subCategoryRepo.findOne({ where: { id }, relations: ['category'] })
    }

    async removeByEntity(entity: SubCategoryEntity) {
        return await this.subCategoryRepo.remove(entity)
    }

    async removeById(id: string) {
        const subCat_e = await this.findById(id)
        if (!subCat_e) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_DELETE, { message: 'SubCategory not found' })
        }
        return await this.removeByEntity(subCat_e)
    }

    async update(id: string, dto: UpdateSubCategoryDto) {
        const subCat_e = await this.subCategoryRepo.findOne({ where: { id } })
        if (!subCat_e) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE, { message: `SubCategory with id ${id} not found` })
        }
        subCat_e.name = dto.name
        return await this.subCategoryRepo.save(subCat_e)
    }

    async create(dto: CreateSubCategoryDto) {
        const cat_e = await this.categoryRepo.findOne({ where: { id: dto.categoryId } })
        if (!cat_e) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE, { message: `Category with id ${dto.categoryId} not found` })
        }
        const subCat_e = new SubCategoryEntity()
        subCat_e.name = dto.name
        subCat_e.category = cat_e
        return await this.subCategoryRepo.save(subCat_e)
    }

    async findPaginated(opts: PaginationDto): Promise<PaginatedResponseDto<SubCategoryEntity>> {
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

        const [entities, overallCount] = await this.subCategoryRepo.findAndCount({
            relations: ['category'],
            skip: (offset - 1) * limit,
            take: limit
        })

        return {
            data: entities,
            pagination: { offset, limit },
            overallCount
        }
    }

    async getAllDocuments() {
        return await this.subCategoryRepo.find({ relations: ['category'] })
    }
}
