import { SupplyOrderStatus } from '@dodzo-web/shared';
import { Restaurant } from '@entities/restaurant/restaurant.entity';
import { Collection, Entity, Enum, Index, ManyToOne, OneToMany, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { SupplierItem } from '../supplier-item.entity';
import { Supplier } from '../supplier.entity';
import { SupplyOrderItem } from './supply-order-item.entity';

@Entity()
export class SupplyOrder {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'orderDate' | 'expectedDeliveryDate' | 'actualDeliveryDate' | 'notes' | 'items' | 'totalAmount' | 'status'

    @PrimaryKey()
    id: string = v4();

    @Property({ unique: true })
    @Index()
    orderNumber: string;

    @ManyToOne(() => Supplier)
    supplier: Supplier;

    @ManyToOne(() => Restaurant)
    restaurant: Restaurant; // Which restaurant is ordering

    @Enum(() => SupplyOrderStatus)
    status: SupplyOrderStatus = SupplyOrderStatus.DRAFT;

    @Property({ nullable: true })
    orderDate?: Date;

    @Property({ nullable: true })
    expectedDeliveryDate?: Date;

    @Property({ nullable: true })
    actualDeliveryDate?: Date;

    @Property({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number = 0;

    @Property()
    currency: string = 'USD';

    @Property({ nullable: true })
    meta?: string;

    @Property({ nullable: true })
    invoiceNumber?: string;

    @OneToMany(() => SupplyOrderItem, item => item.order)
    items = new Collection<SupplyOrderItem>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
