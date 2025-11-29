import { Delivery, DeliveryLocation, DeliveryStatusHistory, Driver } from "@entities/index";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { DeliveryService } from "./services/delivery.service";
import { DriverService } from "./services/driver.service";

@Module({
    imports: [
        MikroOrmModule.forFeature([
            Delivery,
            DeliveryLocation,
            DeliveryStatusHistory,
            Driver,
        ]),
    ],
    controllers: [
    ],
    providers: [
        DeliveryService,
        DriverService
    ],
    exports: [
        DeliveryService,
        DriverService
    ]
})
export class DeliveryModule {}
