import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { ProductPackagingService } from '../services/product-packaging.service';
import { ProductIngredientService } from '../services/product-ingredient.service';
import { RequiredRoles } from 'common/decorators/role.decorator';
import {
    Role,
    CreateProductDto,
    CreateProductIngredientDto,
    CreateProductPackagingDto,
    UpdateProductDto,
    UpdateProductIngredientDto,
    UpdateProductPackagingDto
} from '@dodzo-web/shared';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth('access-token')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly productIngredientService: ProductIngredientService,
        private readonly productPackagingService: ProductPackagingService,
    ) {}

    @RequiredRoles(
        Role.SUPER_ADMIN,
        Role.RESTAURANT_OWNER,
        Role.RESTAURANT_MANAGER
    )
    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    async createProduct(@Body() dto: CreateProductDto) {
        return this.productService.createProduct(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
    async getProducts(
        @Query('restaurant') restaurantId: string,
        @Query('category') categoryId?: string,
        @Query('isActive') isActive?: boolean,
        @Query('search') search?: string,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
    ) {
        return this.productService.getProducts({
            restaurantId,
            categoryId,
            isActive,
            search,
            limit,
            offset,
        });
    }

    @Get('categories')
    @ApiOperation({ summary: 'Get all product categories' })
    @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
    async getCategories() {
        return this.productService.getCategories();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async getProduct(@Param('id') id: string) {
        return this.productService.getProduct(id);
    }

    @RequiredRoles(
        Role.SUPER_ADMIN,
        Role.RESTAURANT_OWNER,
        Role.RESTAURANT_MANAGER
    )
    @Put(':id')
    @ApiOperation({ summary: 'Update product' })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async updateProduct(
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
    ) {
        return this.productService.updateProduct(id, dto);
    }

    @RequiredRoles(
        Role.SUPER_ADMIN,
        Role.RESTAURANT_OWNER,
        Role.RESTAURANT_MANAGER
    )
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Soft delete product' })
    @ApiResponse({ status: 204, description: 'Product deleted successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async deleteProduct(@Param('id') id: string) {
        return this.productService.deleteProduct(id);
    }

    @RequiredRoles(
        Role.SUPER_ADMIN,
        Role.RESTAURANT_OWNER,
        Role.RESTAURANT_MANAGER
    )
    @Delete(':id/hard')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Hard delete product' })
    @ApiResponse({ status: 204, description: 'Product permanently deleted' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async hardDeleteProduct(@Param('id') id: string) {
        return this.productService.hardDeleteProduct(id);
    }

    // PRODUCT INGREDIENTS

    @RequiredRoles(
        Role.SUPER_ADMIN,
        Role.RESTAURANT_OWNER,
        Role.RESTAURANT_MANAGER
    )
    @Post(':id/ingredients')
    @ApiOperation({ summary: 'Add ingredient to product' })
    @ApiResponse({ status: 201, description: 'Ingredient added successfully' })
    async addIngredient(@Body() dto: CreateProductIngredientDto) {
        return this.productIngredientService.addIngredient(dto);
    }

    @Get(':id/ingredients')
    @ApiOperation({ summary: 'Get product ingredients' })
    @ApiResponse({ status: 200, description: 'Ingredients retrieved successfully' })
    async getProductIngredients(
        @Param('id') id: string,
        @Query('isForDelivery') isForDelivery: boolean = false
    ) {
        return this.productIngredientService.getProductIngredients(id, isForDelivery);
    }

    @RequiredRoles(
        Role.SUPER_ADMIN,
        Role.RESTAURANT_OWNER,
        Role.RESTAURANT_MANAGER
    )
    @Put('ingredients/:ingredientId')
    @ApiOperation({ summary: 'Update product ingredient' })
    @ApiResponse({ status: 200, description: 'Ingredient updated successfully' })
    async updateIngredient(
        @Param('ingredientId') ingredientId: string,
        @Body() dto: UpdateProductIngredientDto,
    ) {
        return this.productIngredientService.updateIngredient(ingredientId, dto);
    }

    @RequiredRoles(
        Role.SUPER_ADMIN,
        Role.RESTAURANT_OWNER,
        Role.RESTAURANT_MANAGER
    )
    @Delete('ingredients/:ingredientId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove ingredient from product' })
    @ApiResponse({ status: 204, description: 'Ingredient removed successfully' })
    async removeIngredient(@Param('ingredientId') ingredientId: string) {
        return this.productIngredientService.removeIngredient(ingredientId);
    }

    // PRODUCT PACKAGING

    @RequiredRoles(
        Role.SUPER_ADMIN,
        Role.RESTAURANT_OWNER,
        Role.RESTAURANT_MANAGER
    )
    @Post(':id/packaging')
    @ApiOperation({ summary: 'Add packaging to product' })
    @ApiResponse({ status: 201, description: 'Packaging added successfully' })
    async addPackaging(@Body() dto: CreateProductPackagingDto) {
        return this.productPackagingService.addPackaging(dto);
    }

    @Get(':id/packaging')
    @ApiOperation({ summary: 'Get product packaging' })
    @ApiResponse({ status: 200, description: 'Packaging retrieved successfully' })
    async getProductPackaging(@Param('id') id: string) {
        return this.productPackagingService.getProductPackaging(id);
    }

    @RequiredRoles(
        Role.SUPER_ADMIN,
        Role.RESTAURANT_OWNER,
        Role.RESTAURANT_MANAGER
    )
    @Put('packaging/:packagingId')
    @ApiOperation({ summary: 'Update product packaging' })
    @ApiResponse({ status: 200, description: 'Packaging updated successfully' })
    async updatePackaging(
        @Param('packagingId') packagingId: string,
        @Body() dto: UpdateProductPackagingDto,
    ) {
        return this.productPackagingService.updatePackaging(packagingId, dto);
    }

    @RequiredRoles(
        Role.SUPER_ADMIN,
        Role.RESTAURANT_OWNER,
        Role.RESTAURANT_MANAGER
    )
    @Delete('packaging/:packagingId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove packaging from product' })
    @ApiResponse({ status: 204, description: 'Packaging removed successfully' })
    async removePackaging(@Param('packagingId') packagingId: string) {
        return this.productPackagingService.removePackaging(packagingId);
    }

    // RESTAURANT AVAILABILITY

    @RequiredRoles(
        Role.SUPER_ADMIN,
        Role.RESTAURANT_OWNER,
        Role.RESTAURANT_MANAGER
    )
    @Post(':productId/restaurants/:restaurantId/availability')
    @ApiOperation({ summary: 'Set product availability for restaurant' })
    @ApiResponse({ status: 201, description: 'Availability set successfully' })
    async setRestaurantAvailability(
        @Param('productId') productId: string,
        @Param('restaurantId') restaurantId: string,
        @Body()
        dto: {
            isAvailable?: boolean;
            availableForDelivery?: boolean;
            availableInLounge?: boolean;
            priceOverride?: number;
            estimatedPrepTime?: number;
        },
    ) {
        return this.productService.setRestaurantAvailability(
            productId,
            restaurantId,
            dto,
        );
    }

    @Get('restaurants/:restaurantId')
    @ApiOperation({ summary: 'Get products available at restaurant' })
    @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
    async getRestaurantProducts(
        @Param('restaurantId') restaurantId: string,
        @Query('category') category?: string,
        @Query('availableForDelivery') availableForDelivery?: boolean,
        @Query('availableInLounge') availableInLounge?: boolean,
        @Query('isAvailable') isAvailable?: boolean,
    ) {
        return this.productService.getRestaurantProducts(restaurantId, {
            category,
            availableForDelivery,
            availableInLounge,
            isAvailable,
        });
    }

    @Get(':productId/cost/:restaurantId')
    @ApiOperation({ summary: 'Get product cost breakdown' })
    @ApiResponse({ status: 200, description: 'Cost breakdown retrieved successfully' })
    async getProductCost(
        @Param('productId') productId: string,
        @Query('isForDelivery') isForDelivery: boolean = false,
    ) {
        return this.productService.getProductCost(
            productId,
            isForDelivery,
        );
    }
}
