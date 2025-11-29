import { Cart, CartItem, Product, RestaurantProduct } from "@entities/index";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PromotionModule } from "modules/promotion/promotion.module";
import { CartService } from "./services/cart.service";
import { CartController } from "./controllers/cart.controller";

@Module({
    imports: [
        MikroOrmModule.forFeature([
            Cart,
            CartItem,
            Product,
            RestaurantProduct
        ]),
        PromotionModule,
    ],
    controllers: [
        CartController
    ],
    providers: [ CartService ],
    exports: [ CartService ]
})
export class CartModule {}
