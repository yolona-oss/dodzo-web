import { Product, Wishlist, WishlistItem } from "@entities/index";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { WishlistService } from "./services/wishlist.service";
import { WishlistController } from "./controllers/wishlist.controller";

@Module({
    imports: [
        MikroOrmModule.forFeature([
            Wishlist,
            WishlistItem,
            Product
        ]),
    ],
    controllers: [
        WishlistController
    ],
    providers: [
        WishlistService
    ],
    exports: [
        WishlistService
    ]
})
export class WishlistModule {}
