import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CreateRequestContext, EntityManager } from '@mikro-orm/core';
import {
    Product,
    RestaurantProduct,
    Restaurant,
    Category,
} from 'entities';
import {
    CreateProductDto,
    UpdateProductDto,
} from '@dodzo-web/shared';
import { AppErrors } from 'common/error';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: EntityRepository<Product>,
        @InjectRepository(RestaurantProduct)
        private readonly restaurantProductRepo: EntityRepository<RestaurantProduct>,
        @InjectRepository(Restaurant)
        private readonly restaurantRepo: EntityRepository<Restaurant>,
        private readonly em: EntityManager,
    ) {}

    @CreateRequestContext()
    async createProduct(dto: CreateProductDto): Promise<Product> {
        // Check if SKU already exists
        const existingProduct = await this.productRepo.findOne({ sku: dto.sku });
        if (existingProduct) {
            throw AppErrors.conflict(`Product with SKU ${dto.sku} already exists`);
        }

        const category = await this.em.findOne(Category, dto.categoryId);
        if (!category) {
            throw AppErrors.dbEntityNotFound(`Category with ID ${dto.categoryId} not found`);
        }

        const restaurant = await this.em.findOne(Restaurant, dto.restaurantId);
        if (!restaurant) {
            throw AppErrors.dbEntityNotFound(`Restaurant with ID ${dto.restaurantId} not found`);
        }

        const product = this.productRepo.create({
            category,
            restaurant,
            name: dto.name,
            description: dto.description,
            sku: dto.sku,
            basePrice: dto.basePrice,
            imageUrl: dto.imageUrl,
            isActive: true,
        });

        await this.em.persistAndFlush(product);
        return product;
    }

    async getProduct(productId: string): Promise<Product> {
        const product = await this.productRepo.findOne(
            productId,
            {
                populate: [
                    'ingredients.supplyItem',
                    'packaging.packagingItem',
                    'restaurantAvailability.restaurant',
                ],
            },
        );

        if (!product) {
            throw AppErrors.dbEntityNotFound(`Product with ID ${productId} not found`);
        }

        return product;
    }

    async getProducts(options?: {
        restaurantId: string;
        categoryId?: string;
        isActive?: boolean;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ products: Product[]; total: number }> {
        const where: any = {};

        if (options?.categoryId) {
            where.category = options.categoryId;
        }

        if (options?.restaurantId) {
            where.restaurant = options.restaurantId;
        }

        if (options?.isActive !== undefined) {
            where.isActive = options.isActive;
        }

        if (options?.search) {
            where.$or = [
                { name: { $like: `%${options.search}%` } },
                { description: { $like: `%${options.search}%` } },
                { sku: { $like: `%${options.search}%` } },
            ];
        }

        const [products, total] = await this.productRepo.findAndCount(where, {
            populate: ['ingredients', 'packaging'],
            orderBy: { name: 'ASC' },
            limit: options?.limit || 50,
            offset: options?.offset || 0,
        });

        return { products, total };
    }

    @CreateRequestContext()
    async updateProduct(productId: string, dto: UpdateProductDto): Promise<Product> {
        const product = await this.productRepo.findOneOrFail(productId);

        if (dto.name !== undefined) product.name = dto.name;
        if (dto.description !== undefined) product.description = dto.description;
        if (dto.sku !== undefined) {
            // Check if new SKU already exists
            const existingProduct = await this.productRepo.findOne({
                sku: dto.sku,
                id: { $ne: productId },
            });
            if (existingProduct) {
                throw AppErrors.conflict(`Product with SKU ${dto.sku} already exists`);
            }
            product.sku = dto.sku;
        }
        if (dto.basePrice !== undefined) product.basePrice = dto.basePrice;
        if (dto.categoryId !== undefined) {
            const category = await this.em.findOneOrFail(Category, dto.categoryId);
            product.category = category;
        }
        if (dto.imageUrl !== undefined) product.imageUrl = dto.imageUrl;
        if (dto.isActive !== undefined) product.isActive = dto.isActive;

        await this.em.flush();
        return this.getProduct(productId);
    }

    @CreateRequestContext()
    async deleteProduct(productId: string): Promise<void> {
        const product = await this.productRepo.findOneOrFail(productId);
        product.isActive = false;
        await this.em.flush();
    }

    @CreateRequestContext()
    async hardDeleteProduct(productId: string): Promise<void> {
        const product = await this.productRepo.findOneOrFail(productId);
        await this.em.removeAndFlush(product);
    }

    // RESTAURANT PRODUCT AVAILABILITY

    @CreateRequestContext()
    async setRestaurantAvailability(
        productId: string,
        restaurantId: string,
        dto: {
            isAvailable?: boolean;
            availableForDelivery?: boolean;
            availableInLounge?: boolean;
            priceOverride?: number;
            estimatedPrepTime?: number;
        },
    ): Promise<RestaurantProduct> {
        const product = await this.productRepo.findOneOrFail(productId);
        const restaurant = await this.restaurantRepo.findOneOrFail(restaurantId);

        let restaurantProduct = await this.restaurantProductRepo.findOne({
            product: productId,
            restaurant: restaurantId,
        });

        if (!restaurantProduct) {
            restaurantProduct = this.restaurantProductRepo.create({
                product,
                restaurant,
                isAvailable: dto.isAvailable ?? true,
                availableForDelivery: dto.availableForDelivery ?? true,
                availableInLounge: dto.availableInLounge ?? true,
                priceOverride: dto.priceOverride,
                estimatedPrepTime: dto.estimatedPrepTime,
            });
            await this.em.persistAndFlush(restaurantProduct);
        } else {
            if (dto.isAvailable !== undefined) {
                restaurantProduct.isAvailable = dto.isAvailable;
            }
            if (dto.availableForDelivery !== undefined) {
                restaurantProduct.availableForDelivery = dto.availableForDelivery;
            }
            if (dto.availableInLounge !== undefined) {
                restaurantProduct.availableInLounge = dto.availableInLounge;
            }
            if (dto.priceOverride !== undefined) {
                restaurantProduct.priceOverride = dto.priceOverride;
            }
            if (dto.estimatedPrepTime !== undefined) {
                restaurantProduct.estimatedPrepTime = dto.estimatedPrepTime;
            }
            await this.em.flush();
        }

        return restaurantProduct;
    }

    async getRestaurantProducts(
        restaurantId: string,
        options?: {
            category?: string;
            availableForDelivery?: boolean;
            availableInLounge?: boolean;
            isAvailable?: boolean;
        },
    ): Promise<RestaurantProduct[]> {
        const where: any = {
            restaurant: restaurantId,
        };

        if (options?.isAvailable !== undefined) {
            where.isAvailable = options.isAvailable;
        }
        if (options?.availableForDelivery !== undefined) {
            where.availableForDelivery = options.availableForDelivery;
        }
        if (options?.availableInLounge !== undefined) {
            where.availableInLounge = options.availableInLounge;
        }

        const categoryFilter = options?.category
            ? { product: { category: options.category } }
            : {};

        return this.restaurantProductRepo.find(
            { ...where, ...categoryFilter },
            {
                populate: ['product.ingredients', 'product.packaging'],
                orderBy: { product: { name: 'ASC' } },
            },
        );
    }

    /***
     * @description Calculates the cost of a product based on its ingredients and packaging
     *
     * now implemented
     */
    async getProductCost(
        productId: string,
        isForDelivery: boolean = true,
    ): Promise<{
        totalCost: number;
        ingredients: Array<{ name: string; quantity: number; unit: string; cost: number }>;
        packaging: Array<{ name: string; quantity: number; unit: string; cost: number }>;
    }> {
        const product = await this.getProduct(productId);

        const ingredientCosts = [];
        let totalIngredientCost = 0;

        // Calculate ingredient costs (simplified - should use actual batch costs)
        for (const ingredient of product.ingredients.getItems()) {
            const cost = 0; // TODO: Calculate from RestaurantStock batches
            ingredientCosts.push({
                name: ingredient.supplyItem.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                cost,
            });
            totalIngredientCost += cost;
        }

        const packagingCosts = [];
        let totalPackagingCost = 0;

        // Calculate packaging costs
        const packagingItems = product.packaging
        .getItems()
        .filter((p) =>
            isForDelivery ? p.isRequiredForDelivery : p.isRequiredForLounge,
        );

        for (const packaging of packagingItems) {
            const cost = 0; // TODO: Calculate from RestaurantStock batches
            packagingCosts.push({
                name: packaging.packagingItem.name,
                quantity: packaging.quantity,
                unit: packaging.packagingItem.unit,
                cost,
            });
            totalPackagingCost += cost;
        }

        return {
            totalCost: totalIngredientCost + totalPackagingCost,
            ingredients: ingredientCosts,
            packaging: packagingCosts,
        };
    }

    async getCategories(): Promise<{ id: string; name: string, parentId?: string }[]> {
        const products = await this.productRepo.findAll({
            fields: ['category'],
        });

        const categories = new Set<{ id: string; name: string; parentId?: string }>();
        products.forEach((p) => {
            if (p.category) categories.add({ id: p.category.id, name: p.category.name, parentId: p.category.parentCategoryId });
        });

        return Array.from(categories).sort();
    }
}
