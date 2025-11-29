import 'tsconfig-paths/register';
import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'path';
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
} from '@entities/index'

import { AppConfig } from 'app.config';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const app_config = new AppConfig(configService);

const config = defineConfig<PostgreSqlDriver>({
    driver: PostgreSqlDriver,
    user: app_config.database.user,
    password: app_config.database.pass,
    dbName: app_config.database.name,
    host: app_config.database.host,
    port: parseInt(app_config.database.port),
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
})

export default config;
