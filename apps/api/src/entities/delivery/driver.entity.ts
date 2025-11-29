import { Entity, PrimaryKey, Property, ManyToOne, Enum, OneToMany, Collection, OptionalProps } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Delivery, User } from 'entities';
import { DriverStatus, VehicleType } from '@dodzo-web/shared';

@Entity()
export class Driver {
    [OptionalProps]?:
    'phoneNumber'
    | 'vehicleModel'
    | 'status'
    | 'currentLatitude'
    | 'currentLongitude'
    | 'lastLocationUpdate'
    | 'rating'
    | 'totalDeliveries'
    | 'isActive'
    | 'createdAt'
    | 'updatedAt'

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @ManyToOne(() => User)
    user: User;

    @Enum(() => VehicleType)
    vehicleType: VehicleType;

    @Property()
    vehicleNumber: string;

    @Property({ nullable: true })
    vehicleModel?: string;

    @Property({ nullable: true })
    phoneNumber?: string;

    @Enum(() => DriverStatus)
    status: DriverStatus = DriverStatus.OFFLINE;

    @Property({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    currentLatitude?: number;

    @Property({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    currentLongitude?: number;

    @Property({ nullable: true })
    lastLocationUpdate?: Date;

    @Property({ type: 'decimal', precision: 3, scale: 1, default: 0 })
    rating: number = 0;

    @Property({ default: 0 })
    totalDeliveries: number = 0;

    @Property()
    isActive: boolean = true;

    @Property({ type: 'json', nullable: true })
    metadata?: Record<string, any>;

    @OneToMany(() => Delivery, delivery => delivery.driver)
    deliveries = new Collection<Delivery>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
