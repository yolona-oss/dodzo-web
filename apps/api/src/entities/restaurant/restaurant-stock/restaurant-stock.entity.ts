import { Restaurant } from '@entities/restaurant/restaurant.entity';
import { Collection, Entity, Index, ManyToOne, OneToMany, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { SupplyItem } from 'entities/supply/supply-item.entity';
import { StockMovement } from '@entities/stock/stock-movement.entity';
import { RestaurantBatch } from './restaurant-batch.entity';

@Entity()
@Index({ properties: ['restaurant', 'supplyItem'] })
export class RestaurantStock {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'lastRestockedAt' | 'maxStockLevel' | 'reorderQuantity';

    @PrimaryKey()
    id: string = v4();

    @ManyToOne(() => Restaurant)
    restaurant: Restaurant;

    @ManyToOne(() => SupplyItem)
    supplyItem: SupplyItem;

    @Property({ type: 'decimal', precision: 10, scale: 3 })
    currentStock: number = 0;

    @Property({ type: 'decimal', precision: 10, scale: 3 })
    minStockLevel: number; // Reorder point for this restaurant

    @Property({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    maxStockLevel?: number; // Maximum storage capacity

    @Property({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    reorderQuantity?: number;

    @Property({ nullable: true })
    lastRestockedAt?: Date;

    @OneToMany(() => StockMovement, movement => movement.restaurantStock)
    movements = new Collection<StockMovement>(this);

    @OneToMany(() => RestaurantBatch, batch => batch.restaurantStock)
    batches = new Collection<RestaurantBatch>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
