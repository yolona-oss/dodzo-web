import { Entity, ManyToOne, PrimaryKey, Property, Enum, OptionalProps } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Restaurant } from 'entities/restaurant/restaurant.entity';
import { SupplyItem } from 'entities/supply/supply-item.entity';
import { UnitOfMeasure } from '@dodzo-web/shared';

@Entity()
export class StockTransfer {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'requestedDate' | 'shippedDate' | 'receivedDate' | 'requestedBy' | 'approvedBy' | 'notes';

    @PrimaryKey()
    id: string = v4();

    @Property()
    transferNumber: string;

    @ManyToOne(() => Restaurant)
    fromRestaurant: Restaurant;

    @ManyToOne(() => Restaurant)
    toRestaurant: Restaurant;

    @ManyToOne(() => SupplyItem)
    supplyItem: SupplyItem;

    @Property({ type: 'decimal', precision: 10, scale: 3 })
    quantity: number;

    @Enum(() => UnitOfMeasure)
    unit: UnitOfMeasure;

    @Property()
    requestedDate: Date = new Date();

    @Property({ nullable: true })
    shippedDate?: Date;

    @Property({ nullable: true })
    receivedDate?: Date;

    @Property()
    status: string = 'pending'; // pending, shipped, received, cancelled

    @Property({ nullable: true })
    requestedBy?: string; // User ID

    @Property({ nullable: true })
    approvedBy?: string; // User ID

    @Property({ nullable: true })
    notes?: string;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
