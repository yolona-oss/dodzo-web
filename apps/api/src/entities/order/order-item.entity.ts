import { Entity, PrimaryKey, ManyToOne, Property, OptionalProps } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { Product, Order } from 'entities';

@Entity()
export class OrderItem {
    [OptionalProps]?: 'createdAt' | 'customizations';

    @PrimaryKey()
    id: string = uuid();

    @ManyToOne(() => Order)
    order!: Order;

    @ManyToOne(() => Product)
    product!: Product;

    @Property()
    qty!: number;

    @Property()
    unitPrice!: number;

    @Property({ type: 'json', nullable: true })
    customizations?: Record<string, any>;

    @Property()
    totalPrice!: number;

    @Property()
    createdAt: Date = new Date();
}
