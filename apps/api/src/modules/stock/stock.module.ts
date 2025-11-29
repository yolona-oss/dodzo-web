import { Module } from "@nestjs/common";
import { ProductModule } from "modules/product/product.module";
import { RestaurantStockService } from "./services/restaurant-stock.service";
import { OrderStockService } from "./services/order-stock.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Order, OrderItem, RestaurantBatch, RestaurantStock, StockMovement, StockTransfer, SupplyItem } from "@entities/index";

@Module({
    imports: [
        MikroOrmModule.forFeature([
            Order,
            OrderItem,
            RestaurantStock,
            RestaurantBatch,
            StockMovement,
            SupplyItem,
            StockTransfer,
        ]),
        ProductModule,
    ],
    controllers: [],
    providers: [
        StockTransfer,
        RestaurantStockService,
        OrderStockService
    ],
    exports: [
        RestaurantStockService,
        OrderStockService,
        StockTransfer
    ]
})
export class StockModule {}
