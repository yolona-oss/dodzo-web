import { Promotion } from "@entities/promotion.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PromotionService } from "./services/promotion.service";

@Module({
    imports: [
        MikroOrmModule.forFeature([Promotion])
    ],
    controllers: [],
    providers: [PromotionService],
    exports: [PromotionService]
})
export class PromotionModule {}
