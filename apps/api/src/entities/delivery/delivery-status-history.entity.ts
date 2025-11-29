import { Entity, PrimaryKey, ManyToOne, Property, Enum, OptionalProps } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Delivery } from './delivery.entity';
import { DeliveryStatus } from '@dodzo-web/shared';

@Entity()
export class DeliveryStatusHistory {
    [OptionalProps]?: 'notes' | 'latitude' | 'longitude' | 'timestamp' | 'updatedBy';

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @ManyToOne(() => Delivery)
    delivery: Delivery;

    @Enum(() => DeliveryStatus)
    status: DeliveryStatus;

    @Property({ nullable: true })
    notes?: string;

    @Property({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    latitude?: number;

    @Property({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    longitude?: number;

    @Property()
    timestamp: Date = new Date();

    @Property({ nullable: true })
    updatedBy?: string; // User ID or system
}
