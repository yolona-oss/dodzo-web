import { ProductStockEntity } from "common/entities/ProductStock.entity";
import { ProductStockSettingEntity } from "common/entities/ProductStockSetting.entity";

export class StockUtils {
    static hasSufficientStock(
        stock: ProductStockEntity,
        quantity: number,
        settings: ProductStockSettingEntity,
    ): boolean {
        if (stock.isInfinite) return true;
        if (settings.allowNegativeStock) return true;
        return stock.count! >= quantity;
    }

    static decreaseStock(
        stock: ProductStockEntity,
        quantity: number,
        settings: ProductStockSettingEntity,
    ): ProductStockEntity {
        if (stock.isInfinite) return stock;

        if (!this.hasSufficientStock(stock, quantity, settings)) {
            throw new Error("Insufficient stock");
        }

        stock.count! -= quantity;
        return stock;
    }

    static increaseStock(stock: ProductStockEntity, quantity: number): ProductStockEntity {
        if (stock.isInfinite) return stock;
        stock.count! += quantity;
        return stock;
    }
}
