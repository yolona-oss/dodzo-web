import { Entity, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { RestaurantStock } from './restaurant-stock.entity';
import { v4 } from 'uuid';
import { Batch } from '@entities/stock/batch.entity';

@Entity()
export class RestaurantBatch {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'receivedDate' | 'expirationDate' | 'unitCost' | 'sourceBatch' | 'notes';

    @PrimaryKey()
    id: string = v4();

    @Property()
    batchNumber: string;

    @ManyToOne(() => RestaurantStock)
    restaurantStock: RestaurantStock;

    @ManyToOne(() => Batch, { nullable: true })
    sourceBatch?: Batch; // Original batch from supplier

    @Property({ type: 'decimal', precision: 10, scale: 3 })
    quantity: number;

    @Property({ type: 'decimal', precision: 10, scale: 3 })
    remainingQuantity: number;

    @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    unitCost?: number;

    @Property({ nullable: true })
    expirationDate?: Date;

    @Property()
    receivedDate: Date = new Date();

    @Property({ nullable: true })
    notes?: string;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
