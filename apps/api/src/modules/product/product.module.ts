import { Module } from "@nestjs/common";
import { ProductIngredientService } from "./services/product-ingredient.service";
import { ProductService } from "./services/product.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Product, ProductIngredient, ProductPackaging, Restaurant, RestaurantProduct, SupplyItem } from "@entities/index";
import { ProductController } from "./controllers/product.controller";
import { ProductPackagingService } from "./services/product-packaging.service";

@Module({
    imports: [
        MikroOrmModule.forFeature([
            Product,
            ProductIngredient,
            ProductPackaging,
            RestaurantProduct,
            SupplyItem,
            Restaurant,
        ])
    ],
    controllers: [
        ProductController
    ],
    providers: [
        ProductService,
        ProductIngredientService,
        ProductPackagingService,
    ],
    exports: [
        ProductService,
        ProductIngredientService,
        ProductPackagingService
    ]
})
export class ProductModule {}
