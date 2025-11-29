import { SupplyItemType, UnitOfMeasure } from "@dodzo-web/shared";
import { IngredientComposition, SupplyItem } from "@entities/index";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { AppErrors } from "common/error";

@Injectable()
export class IngredientCompositionService {
    constructor(
        @InjectRepository(IngredientComposition)
        private readonly compositionRepo: EntityRepository<IngredientComposition>,
        @InjectRepository(SupplyItem)
        private readonly supplyItemRepo: EntityRepository<SupplyItem>,
        private readonly em: EntityManager,
    ) {}

    async createComposition(dto: {
        complexIngredientId: string;
        supplyItemId: string;
        quantity: number;
        unit: UnitOfMeasure;
        notes?: string;
    }): Promise<IngredientComposition> {
        const complexIngredient = await this.supplyItemRepo.findOneOrFail(
            dto.complexIngredientId,
        );
        const supplyItem = await this.supplyItemRepo.findOneOrFail(dto.supplyItemId);

        // Validate that complex ingredient is of type COMPLEX_INGREDIENT
        if (complexIngredient.type !== SupplyItemType.COMPLEX_INGREDIENT) {
            throw AppErrors.invalidData('Complex ingredient must be of type COMPLEX_INGREDIENT');
        }

        // Check if composition already exists
        const existing = await this.compositionRepo.findOne({
            complexIngredient: dto.complexIngredientId,
            supplyItem: dto.supplyItemId,
        });

        if (existing) {
            throw AppErrors.badRequest('This ingredient is already part of the composition');
        }

        const composition = this.compositionRepo.create({
            complexIngredient,
            supplyItem,
            quantity: dto.quantity,
            unit: dto.unit,
            notes: dto.notes,
        });

        await this.em.persistAndFlush(composition);
        return composition;
    }

    async getComposition(complexIngredientId: string): Promise<IngredientComposition[]> {
        return this.compositionRepo.find(
            { complexIngredient: complexIngredientId },
            { populate: ['supplyItem'], orderBy: { createdAt: 'ASC' } },
        );
    }

    async updateComposition(
        compositionId: string,
        dto: {
            quantity?: number;
            unit?: UnitOfMeasure;
            notes?: string;
        },
    ): Promise<IngredientComposition> {
        const composition = await this.compositionRepo.findOneOrFail(compositionId);

        if (dto.quantity !== undefined) composition.quantity = dto.quantity;
        if (dto.unit !== undefined) composition.unit = dto.unit;
        if (dto.notes !== undefined) composition.notes = dto.notes;

        await this.em.flush();
        return composition;
    }

    async deleteComposition(compositionId: string): Promise<void> {
        const composition = await this.compositionRepo.findOneOrFail(compositionId);
        await this.em.removeAndFlush(composition);
    }

    async calculateComplexIngredientCost(
        complexIngredientId: string,
    ): Promise<{
        totalCost: number;
        breakdown: Array<{
            ingredientName: string;
            quantity: number;
            unit: string;
            costPerUnit: number;
            totalCost: number;
        }>;
    }> {
        const compositions = await this.getComposition(complexIngredientId);
        const breakdown = [];
        let totalCost = 0;

        for (const comp of compositions) {
            // TODO: Get actual cost from RestaurantStock batches
            const costPerUnit = 0; // Placeholder
            const itemTotalCost = comp.quantity * costPerUnit;

            breakdown.push({
                ingredientName: comp.supplyItem.name,
                quantity: comp.quantity,
                unit: comp.unit,
                costPerUnit,
                totalCost: itemTotalCost,
            });

            totalCost += itemTotalCost;
        }

        return {
            totalCost: Number(totalCost.toFixed(2)),
            breakdown,
        };
    }

    async getSupplyItemUsage(supplyItemId: string): Promise<
    Array<{
        complexIngredientId: string;
        complexIngredientName: string;
        quantity: number;
        unit: string;
    }>
    > {
        const compositions = await this.compositionRepo.find(
            { supplyItem: supplyItemId },
            { populate: ['complexIngredient'] },
        );

        return compositions.map((comp) => ({
            complexIngredientId: comp.complexIngredient.id,
            complexIngredientName: comp.complexIngredient.name,
            quantity: comp.quantity,
            unit: comp.unit,
        }));
    }
}
