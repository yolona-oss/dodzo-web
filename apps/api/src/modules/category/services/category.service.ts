import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestContext, Populate, wrap } from '@mikro-orm/core';
import { Category } from '@entities/category.entity'; 
import { Restaurant } from '@entities/index'; 
import { EntityManager } from '@mikro-orm/postgresql';
import { ImageService } from 'modules/file-upload/services/image.service';
import { CreateCategoryDto, ImageTypeEnum } from '@dodzo-web/shared';
import { AppError, AppErrors, AppErrorTypeEnum } from 'common/error';

@Injectable()
export class CategoryService {
    constructor(
        private readonly em: EntityManager,
        private readonly imageService: ImageService,
    ) {}

    @CreateRequestContext()
    async assignImage(catId: string, imageId: string) {
        await this.imageService.attachImage(imageId, { ownerId: catId, ownerType: ImageTypeEnum.Category });
    }

    @CreateRequestContext()
    async create(dto: CreateCategoryDto) {
        const restaurant = await this.em.findOneOrFail(Restaurant, { id: dto.restaurantId });
        if (!restaurant) {
            throw AppErrors.dbEntityNotFound(`Restaurant ${dto.restaurantId} not found`);
        }

        const cat = this.em.create(Category, {
            name: dto.name,
            description: dto.description,
            restaurant
        });

        if (dto.imageId) {
            try {
                await this.assignImage(cat.id, dto.imageId);
            } catch (e: any) {
                if (e instanceof AppError) {
                    if (e.errorCode === AppErrorTypeEnum.DB_ENTITY_NOT_FOUND) {
                        throw AppErrors.dbCannotCreate(`Image ${dto.imageId} not found`)
                    }
                } else {
                    throw AppErrors.badRequest(JSON.stringify(e))
                }
            }
        }

        await this.em.persistAndFlush(cat);
        return cat;
    }

    @CreateRequestContext()
    async findAll(restaurantId?: string, relations: Populate<Category, never> = []) {
        const filters = restaurantId ? { restaurant: restaurantId } : {};
        return this.em.find(Category, filters, { populate: relations });
    }

    async findOne(id: string, relations: Populate<Category, never> = []) {
        const category = await this.em.findOne(Category, { id }, { populate: relations });
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }

    @CreateRequestContext()
    async update(id: string, data: Partial<Category>) {
        const category = await this.findOne(id);
        wrap(category).assign(data)
        await this.em.persistAndFlush(category);
        return category;
    }

    async remove(id: string) {
        const category = await this.findOne(id);
        await this.em.removeAndFlush(category);
        return { deleted: true };
    }
}
