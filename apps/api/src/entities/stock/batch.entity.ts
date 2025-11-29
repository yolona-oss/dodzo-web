import { RestaurantBatch } from '@entities/restaurant/restaurant-stock/restaurant-batch.entity';
import { SupplyItem } from '@entities/supply/supply-item.entity';
import { SupplyOrder } from '@entities/supply/supply-order/supply-order.entity';
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, OptionalProps } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Batch {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'notes' | 'unitCost' | 'receivedDate' | 'expirationDate' | 'supplyOrder'

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @Property()
    batchNumber: string;

    @ManyToOne(() => SupplyItem)
    supplyItem: SupplyItem;

    @ManyToOne(() => SupplyOrder, { nullable: true })
    supplyOrder?: SupplyOrder;

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

    @OneToMany(() => RestaurantBatch, rb => rb.sourceBatch)
    restaurantBatches = new Collection<RestaurantBatch>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
