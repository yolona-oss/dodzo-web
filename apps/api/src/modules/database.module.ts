import { Module } from "@nestjs/common"
import { AppConfig } from "app.config";

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import {
    Promotion,
    ProductIngredient,
    ProductPackaging,
    IngredientComposition,
    Category,
    WSchedule,
    SupplyItem,
    Supplier,
    SupplyOrder,
    SupplyOrderItem,
    SupplierItem,
    Employee,
    Product,
    Delivery,
    Driver,
    ExpenseCategory,
    Expense,
    CartItem,
    Cart,
    CartPromotion,
    Session,
    User,
    Restaurant,
    RestaurantProduct,
    RestaurantStock,
    RestaurantBatch,
    Payment,
    Address,
    StockMovement,
    Batch,
    Unit,
    StockTransfer,
    Image,
    OrderItem,
    Order,
    Wishlist,
    WishlistItem
} from 'entities'
import path from "path";

@Module({
    imports: [
        MikroOrmModule.forRootAsync({
            useFactory: (config: AppConfig) => {
                return {
                    driver: PostgreSqlDriver,
                    user: config.database.user,
                    password: config.database.pass,
                    dbName: config.database.name,
                    host: config.database.host,
                    port: parseInt(config.database.port),
                    entities: [
                        Promotion,
                        ProductIngredient,
                        ProductPackaging,
                        IngredientComposition,
                        Category,
                        WSchedule,
                        SupplyItem,
                        Supplier,
                        SupplyOrder,
                        SupplyOrderItem,
                        SupplierItem,
                        Employee,
                        Product,
                        Delivery,
                        Driver,
                        ExpenseCategory,
                        Expense,
                        CartItem,
                        Cart,
                        CartPromotion,
                        Session,
                        User,
                        Restaurant,
                        RestaurantProduct,
                        RestaurantStock,
                        RestaurantBatch,
                        Payment,
                        Address,
                        StockMovement,
                        Batch,
                        Unit,
                        StockTransfer,
                        Image,
                        OrderItem,
                        Order,
                        Wishlist,
                        WishlistItem
                    ],
                    migrations: {
                        path: path.join(process.cwd(), 'migrations'),
                        // pattern: /^[\w-]+\d+\.[tj]s$/,
                    },
                    debug: process.env.NODE_ENV !== 'production',
                }
            },
            inject: [AppConfig],
        }),
    ],
})
export class DatabaseModule { }
