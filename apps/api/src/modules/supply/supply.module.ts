import { Batch, RestaurantBatch, RestaurantStock, Supplier, SupplierItem, SupplyItem, SupplyOrder, SupplyOrderItem } from "@entities/index";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { SupplyOrderService } from "./services/supply-order.service";
import { BatchService } from "./services/batch.service";
import { SupplierItemService } from "./services/supplier-item.service";
import { SupplierService } from "./services/supplier.service";
import { SupplyItemService } from "./services/supply-item.service";
import { StockModule } from "modules/stock/stock.module";

@Module({
    imports: [
        MikroOrmModule.forFeature([
            Batch,
            RestaurantBatch,
            SupplyItem,
            SupplyOrder,
            SupplyOrderItem,
            SupplierItem,
            Supplier,
            RestaurantStock,
        ]),
        StockModule,
    ],
    controllers: [

    ],
    providers: [
        BatchService,
        SupplierItemService,
        SupplierService,
        SupplyItemService,
        SupplyOrderService,
    ],
    exports: [
        BatchService,
        SupplierItemService,
        SupplierService,
        SupplyItemService,
        SupplyOrderService,
    ]
})
export class SupplyModule {}
