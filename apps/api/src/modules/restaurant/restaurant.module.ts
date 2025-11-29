import { Restaurant } from '@entities/index';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RestaurantService } from './services/restaurant.service';
import { RestaurantController } from './controllers/restaurant.controller';

@Module({
    imports: [
        MikroOrmModule.forFeature([
            Restaurant
        ])
    ],
    controllers: [RestaurantController],
    providers: [RestaurantService],
    exports: [RestaurantService]
})
export class RestaurantModule {}
