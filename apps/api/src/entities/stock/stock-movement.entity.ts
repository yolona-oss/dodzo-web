import { Entity, PrimaryKey, Property, Enum, ManyToOne, OptionalProps } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { RestaurantStock } from 'entities/restaurant/restaurant-stock/restaurant-stock.entity';
import { RestaurantBatch } from 'entities/restaurant/restaurant-stock/restaurant-batch.entity';
import { StockMovementType } from '@dodzo-web/shared';
import { UnitOfMeasure } from '@dodzo-web/shared';

@Entity()
export class StockMovement {
    [OptionalProps]?: 'createdAt' | 'batch' | 'referenceId' | 'referenceType' | 'reason' | 'userId' | 'costPerUnit' | 'notes'

    @PrimaryKey()
    id: string = v4();

    @ManyToOne(() => RestaurantStock)
    restaurantStock: RestaurantStock;

    @ManyToOne(() => RestaurantBatch, { nullable: true })
    batch?: RestaurantBatch;

    @Enum(() => StockMovementType)
    type: StockMovementType;

    @Property({ type: 'decimal', precision: 10, scale: 3 })
    quantity: number; // Positive for incoming, negative for outgoing

    @Enum(() => UnitOfMeasure)
    unit: UnitOfMeasure;

    @Property({ nullable: true })
    referenceId?: string; // Order ID, transfer ID, etc.

    @Property({ nullable: true })
    referenceType?: string; // 'supply_order', 'transfer', 'production', 'sale'

    @Property({ nullable: true })
    reason?: string;

    @Property({ nullable: true })
    userId?: string;

    @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    costPerUnit?: number;

    @Property()
    movementDate: Date = new Date();

    @Property({ nullable: true })
    notes?: string;

    @Property()
    createdAt: Date = new Date();
}
