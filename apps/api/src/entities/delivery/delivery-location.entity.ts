import { Entity, PrimaryKey, ManyToOne, Property, Index, OptionalProps } from '@mikro-orm/core';
import { Delivery } from './delivery.entity';
import { v4 } from 'uuid';

@Entity()
@Index({ properties: ['delivery', 'timestamp'] })
export class DeliveryLocation {
    [OptionalProps]?: 'accuracy' | 'speed' | 'heading' | 'altitude' | 'timestamp' | 'metadata';

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @ManyToOne(() => Delivery)
    delivery: Delivery;

    @Property({ type: 'decimal', precision: 10, scale: 7 })
    latitude: number;

    @Property({ type: 'decimal', precision: 10, scale: 7 })
    longitude: number;

    @Property({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    accuracy?: number; // in meters

    @Property({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    speed?: number; // in km/h

    @Property({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    heading?: number; // in degrees (0-360)

    @Property({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    altitude?: number; // in meters

    @Property()
    timestamp: Date = new Date();

    @Property({ type: 'json', nullable: true })
    metadata?: Record<string, any>; // battery level, network type, etc.
}
