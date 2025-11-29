import { Order, OrderItem, Product, RestaurantProduct } from "@entities/index";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { CartModule } from "modules/cart/cart.module";
import { OrderService } from "./services/order.service";
import { StockModule } from "modules/stock/stock.module";
import { ProductModule } from "modules/product/product.module";

@Module({
    imports: [
        MikroOrmModule.forFeature([
            Order,
            OrderItem,
            Product,
            RestaurantProduct,
        ]),
        CartModule,
        StockModule,
        ProductModule
    ],
    controllers: [
    ],
    providers: [
        OrderService,
    ],
    exports: [
        OrderService,
    ]
})
export class OrderModule { }
