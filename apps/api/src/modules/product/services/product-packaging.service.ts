import { Injectable } from "@nestjs/common";

import { 
    CreateProductPackagingDto,
    UpdateProductPackagingDto,
} from '@dodzo-web/shared';
import { Product, ProductPackaging, SupplyItem } from "@entities/index";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CreateRequestContext, EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { AppErrors } from "common/error";

@Injectable()
export class ProductPackagingService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: EntityRepository<Product>,
        @InjectRepository(ProductPackaging)
        private readonly packagingRepo: EntityRepository<ProductPackaging>,
        @InjectRepository(SupplyItem)
        private readonly supplyItemRepo: EntityRepository<SupplyItem>,
        private readonly em: EntityManager
    ) {}

    @CreateRequestContext()
    async addPackaging(dto: CreateProductPackagingDto): Promise<ProductPackaging> {
        const product = await this.productRepo.findOneOrFail(dto.productId);
        const packagingItem = await this.supplyItemRepo.findOneOrFail(dto.packagingItemId);

        const existingPackaging = await this.packagingRepo.findOne({
            product: dto.productId,
            packagingItem: dto.packagingItemId,
        });

        if (existingPackaging) {
            throw AppErrors.conflict('This packaging is already added to the product');
        }

        const packaging = this.packagingRepo.create({
            product,
            packagingItem,
            quantity: dto.quantity,
            isRequiredForDelivery: dto.isRequiredForDelivery ?? true,
            isRequiredForLounge: dto.isRequiredForLounge ?? false,
            notes: dto.notes,
        });

        await this.em.persistAndFlush(packaging);
        return packaging;
    }

    async getProductPackaging(productId: string): Promise<ProductPackaging[]> {
        return this.packagingRepo.find(
            { product: productId },
            { populate: ['packagingItem'], orderBy: { createdAt: 'ASC' } },
        );
    }

    @CreateRequestContext()
    async updatePackaging(
        packagingId: string,
        dto: UpdateProductPackagingDto,
    ): Promise<ProductPackaging> {
        const packaging = await this.packagingRepo.findOneOrFail(packagingId);

        if (dto.quantity !== undefined) packaging.quantity = dto.quantity;
        if (dto.isRequiredForDelivery !== undefined) {
            packaging.isRequiredForDelivery = dto.isRequiredForDelivery;
        }
        if (dto.isRequiredForLounge !== undefined) {
            packaging.isRequiredForLounge = dto.isRequiredForLounge;
        }
        if (dto.notes !== undefined) packaging.notes = dto.notes;

        await this.em.flush();
        return packaging;
    }

    @CreateRequestContext()
    async removePackaging(packagingId: string): Promise<void> {
        const packaging = await this.packagingRepo.findOneOrFail(packagingId);
        await this.em.removeAndFlush(packaging);
    }
}
