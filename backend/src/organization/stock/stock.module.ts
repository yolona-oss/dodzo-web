import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductStockEntity } from "common/entities/ProductStock.entity";
import { ProductStockService } from "./services/stock.service";
import { ProductStockController } from "./controllers/stock.controller";
import { ProductEntity } from "common/entities/Product.entity";
import { OrganizationEntity } from "common/entities/Organization.entity";
import { ProductStockSettingEntity } from "common/entities/ProductStockSetting.entity";
import { ProductStockSettingService } from "./services/stock-setting.service";
import { ProductStockSettingController } from "./controllers/stock-setting.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductStockEntity,
            ProductStockSettingEntity,
            ProductEntity,
            OrganizationEntity
        ])
    ],
    providers: [
        ProductStockService,
        ProductStockSettingService
    ],
    controllers: [
        ProductStockController,
        ProductStockSettingController
    ],
    exports: [
        ProductStockService,
        ProductStockSettingService
    ],
})
export class ProductStockModule {}
