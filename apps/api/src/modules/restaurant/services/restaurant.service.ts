import { EntityManager, Populate } from '@mikro-orm/postgresql';
import { CreateRequestContext } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Restaurant, WSchedule } from '@entities/index';
import { CreateRestaurantDto, FindRestaurantDto, PaginatedResponseDto, PaginationDto } from '@dodzo-web/shared';
import { Address } from '@entities/address.entity';
import { AppErrors } from 'common/error';

@Injectable()
export class RestaurantService {
    constructor(
        private readonly em: EntityManager
    ) {}

    @CreateRequestContext()
    async findById(id: string, relations: Populate<Restaurant, never> = []) {
        return await this.em.findOne(Restaurant, id, { populate: relations });
    }

    @CreateRequestContext()
    async findBySlug(slug: string, relations: Populate<Restaurant, never> = []) {
        return await this.em.findOne(Restaurant, { slug }, { populate: relations });
    }

    @CreateRequestContext()
    async find(dto: FindRestaurantDto, relations: Populate<Restaurant, never> = []): Promise<PaginatedResponseDto<Restaurant>> {
        const pagination = dto.pagination;

        const [data, count] = await this.em.findAndCount(
            Restaurant, {},
            {
                limit: pagination.limit,
                offset: pagination.offset,
                populate: relations,
            });

        return {
            data,
            overallCount: count,
            pagination: {
                offset: pagination.offset,
                limit: pagination.limit
            },
        }
    }

    @CreateRequestContext()
    async create(dto: CreateRestaurantDto): Promise<Restaurant> {
        const address = await this.em.findOne(Address, dto.addressId);
        if (!address) {
            throw AppErrors.dbEntityNotFound(`Address ${dto.addressId} not found`);
        }

        const schedule = await this.em.findOne(WSchedule, dto.scheduleId);
        if (!schedule) {
            throw AppErrors.dbEntityNotFound(`Schedule ${dto.scheduleId} not found`);
        }

        const restaurant = new Restaurant();
        restaurant.name = dto.name;
        restaurant.slug = dto.slug;
        restaurant.timezone = dto.timezone;
        restaurant.address = address;
        restaurant.hasLounge = dto.hasLounge?.match(/true/i) ? true : false;
        restaurant.hasDelivery = dto.hasDelivery?.match(/true/i) ? true : false;
        restaurant.schedule = schedule;
        restaurant.deliverySettings = dto.deliverySettings && JSON.parse(dto.deliverySettings);

        await this.em.persistAndFlush(restaurant);
        return restaurant;
    }
}
