import { Entity, PrimaryKey, ManyToOne, Property, Index, Enum, OneToMany, Collection, OptionalProps } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Driver, Order } from 'entities';
import { DeliveryStatus } from '@dodzo-web/shared';
import { DeliveryLocation } from './delivery-location.entity';
import { DeliveryStatusHistory } from './delivery-status-history.entity';

@Entity()
@Index({ properties: ['order', 'status'] })
export class Delivery {

    // one string in one column
    [OptionalProps]?:
    'createdAt'
    | 'updatedAt'
    | 'driver'
    | 'status'
    | 'customerName'
    | 'customerPhone'
    | 'deliveryNotes'
    | 'estimatedDuration'
    | 'estimatedDuration'
    | 'estimatedDeliveryTime'
    | 'actualDeliveryTime'
    | 'assignedAt'
    | 'acceptedAt'
    | 'pickedUpAt'
    | 'deliveredAt'
    | 'failureReason'
    | 'proofOfDelivery'
    | 'rating'
    | 'feedback'
    | 'locationHistory'
    | 'statusHistory'

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @Property({ unique: true })
    @Index()
    deliveryNumber: string;

    @ManyToOne(() => Order)
    order: Order;

    @ManyToOne(() => Driver, { nullable: true })
    driver?: Driver;

    @Enum(() => DeliveryStatus)
    status: DeliveryStatus = DeliveryStatus.PENDING;

    @Property()
    pickupAddress: string;

    @Property({ type: 'decimal', precision: 10, scale: 7 })
    pickupLatitude: number;

    @Property({ type: 'decimal', precision: 10, scale: 7 })
    pickupLongitude: number;

    @Property()
    deliveryAddress: string;

    @Property({ type: 'decimal', precision: 10, scale: 7 })
    deliveryLatitude: number;

    @Property({ type: 'decimal', precision: 10, scale: 7 })
    deliveryLongitude: number;

    @Property({ nullable: true })
    customerName?: string;

    @Property({ nullable: true })
    customerPhone?: string;

    @Property({ nullable: true })
    deliveryNotes?: string;

    @Property({ type: 'decimal', precision: 10, scale: 2 })
    deliveryFee: number;

    @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    estimatedDistance?: number; // in kilometers

    @Property({ nullable: true })
    estimatedDuration?: number; // in minutes

    @Property({ nullable: true })
    assignedAt?: Date;

    @Property({ nullable: true })
    acceptedAt?: Date;

    @Property({ nullable: true })
    pickedUpAt?: Date;

    @Property({ nullable: true })
    deliveredAt?: Date;

    @Property({ nullable: true })
    estimatedDeliveryTime?: Date;

    @Property({ nullable: true })
    actualDeliveryTime?: Date;

    @Property({ nullable: true })
    failureReason?: string;

    @Property({ type: 'json', nullable: true })
    proofOfDelivery?: {
        signature?: string;
        photo?: string;
        notes?: string;
        receivedBy?: string;
    };

    @Property({ type: 'decimal', precision: 2, scale: 1, nullable: true })
    rating?: number;

    @Property({ nullable: true })
    feedback?: string;

    @OneToMany(() => DeliveryLocation, location => location.delivery)
    locationHistory = new Collection<DeliveryLocation>(this);

    @OneToMany(() => DeliveryStatusHistory, history => history.delivery)
    statusHistory = new Collection<DeliveryStatusHistory>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
