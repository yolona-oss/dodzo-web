import { Product, ProductIngredient, ProductPackaging, SupplyItem } from "@entities/index";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CreateRequestContext, EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { AppErrors } from "common/error";
import {
    CreateProductIngredientDto,
    UnitOfMeasure,
    UpdateProductIngredientDto
} from "@dodzo-web/shared";

@Injectable()
export class ProductIngredientService {
    constructor(
        @InjectRepository(ProductIngredient)
        private readonly productIngredientRepo: EntityRepository<ProductIngredient>,
        @InjectRepository(ProductPackaging)
        private readonly productPackagingRepo: EntityRepository<ProductPackaging>,
        @InjectRepository(SupplyItem)
        private readonly supplyItemRepo: EntityRepository<SupplyItem>,
        @InjectRepository(Product)
        private readonly productRepo: EntityRepository<Product>,
        private readonly em: EntityManager
    ) {}

    async getProductIngredients(
        productId: string,
        isForDelivery: boolean,
    ): Promise<Array<{ supplyItemId: string; quantity: number; unit: UnitOfMeasure }>> {
        const ingredients = await this.productIngredientRepo.find(
            { product: productId },
            { populate: ['supplyItem'] },
        );

        const packaging = await this.productPackagingRepo.find(
            { 
                product: productId,
                ...(isForDelivery 
                    ? { isRequiredForDelivery: true }
                    : { isRequiredForLounge: true }
                ),
            },
            { populate: ['packagingItem'] },
        );

        return [
            ...ingredients.map((ing) => ({
                supplyItemId: ing.supplyItem.id,
                quantity: ing.quantity,
                unit: ing.unit,
            })),
            ...packaging.map((pkg) => ({
                supplyItemId: pkg.packagingItem.id,
                quantity: pkg.quantity,
                unit: pkg.packagingItem.unit,
            })),
        ];
    }

    async calculateProductCost(
        productId: string,
        isForDelivery: boolean,
    ): Promise<number> {
        const ingredients = await this.getProductIngredients(productId, isForDelivery);
        let totalCost = 0;

        // This would need to fetch average cost from batches
        // Implementation depends on your costing strategy (FIFO, LIFO, Average)

        return totalCost;
    }

    @CreateRequestContext()
    async addIngredient(dto: CreateProductIngredientDto): Promise<ProductIngredient> {
        const product = await this.productRepo.findOneOrFail(dto.productId);
        const supplyItem = await this.supplyItemRepo.findOneOrFail(dto.supplyItemId);

        // Check if ingredient already exists
        const existingIngredient = await this.productIngredientRepo.findOne({
            product: dto.productId,
            supplyItem: dto.supplyItemId,
        });

        if (existingIngredient) {
            throw AppErrors.conflict(`Ingredient already exists for product ${product.name}`);
        }

        const ingredient = this.productIngredientRepo.create({
            product,
            supplyItem,
            quantity: dto.quantity,
            unit: dto.unit,
            notes: dto.notes,
        });

        await this.em.persistAndFlush(ingredient);
        return ingredient;
    }

    async getProductIngredientsSimple(productId: string): Promise<ProductIngredient[]> {
        return this.productIngredientRepo.find(
            { product: productId },
            { populate: ['supplyItem'], orderBy: { createdAt: 'ASC' } },
        );
    }

    @CreateRequestContext()
    async updateIngredient(
        ingredientId: string,
        dto: UpdateProductIngredientDto,
    ): Promise<ProductIngredient> {
        const ingredient = await this.productIngredientRepo.findOneOrFail(ingredientId);

        if (dto.quantity !== undefined) ingredient.quantity = dto.quantity;
        if (dto.unit !== undefined) ingredient.unit = dto.unit;
        if (dto.notes !== undefined) ingredient.notes = dto.notes;

        await this.em.flush();
        return ingredient;
    }

    @CreateRequestContext()
    async removeIngredient(ingredientId: string): Promise<void> {
        const ingredient = await this.productIngredientRepo.findOneOrFail(ingredientId);
        await this.em.removeAndFlush(ingredient);
    }
}
