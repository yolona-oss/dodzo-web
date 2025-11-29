import { Entity, PrimaryKey, Property, OneToMany, ManyToOne, Collection, t, OptionalProps } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { User, OrderItem, Payment, Delivery, Restaurant } from 'entities'

import { OrderStatus, OrderType } from '@dodzo-web/shared';

@Entity()
export class Order {
    [OptionalProps]?: 'items' | 'closedAt' | 'updatedAt' | 'createdAt' | 'pickupTime' | 'status' | 'payment' | 'delivery' | 'deliveryFee' | 'meta' | 'tip'

    @PrimaryKey()
    id: string = uuid();

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Restaurant)
    restaurant!: Restaurant;

    @Property({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount!: number; // pay

    @Property({ default: OrderStatus.CREATED })
    status: OrderStatus = OrderStatus.CREATED;

    @OneToMany(() => OrderItem, oi => oi.order)
    items = new Collection<OrderItem>(this);

    @Property({type: "datetime", nullable: true})
    pickupTime: Date | null

    @ManyToOne(() => Payment, { nullable: true })
    payment?: Payment;

    @ManyToOne(() => Delivery, { nullable: true })
    delivery?: Delivery;

    @Property({ type: 'decimal', precision: 10, scale: 2 })
    tip: number = 0;

    @Property({ type: t.string })
    orderType: OrderType

    @Property({ type: 'decimal', precision: 10, scale: 2 })
    deliveryFee: number = 0;

    @Property({ type: t.json, nullable: true })
    meta?: any

    @Property({ type: 'datetime' })
    createdAt = new Date();

    @Property({ type: 'datetime', nullable: true })
    closedAt?: Date;

    @Property({ type: 'datetime', onUpdate: () => new Date() })
    updatedAt = new Date();
}
