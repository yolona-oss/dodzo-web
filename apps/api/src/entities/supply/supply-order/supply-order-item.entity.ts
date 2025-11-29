import { Entity, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { SupplierItem } from 'entities/supply/supplier-item.entity';
import { SupplyOrder } from 'entities/supply/supply-order/supply-order.entity';

@Entity()
export class SupplyOrderItem {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'notes' | 'quantityReceived'

    @PrimaryKey()
    id: string = v4();

    @ManyToOne(() => SupplyOrder)
    order: SupplyOrder;

    @ManyToOne(() => SupplierItem)
    supplierItem: SupplierItem;

    @Property({ type: 'decimal', precision: 10, scale: 3 })
    quantityOrdered: number;

    @Property({ type: 'decimal', precision: 10, scale: 3 })
    quantityReceived: number = 0;

    @Property({ type: 'decimal', precision: 10, scale: 2 })
    unitPrice: number;

    @Property({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;

    @Property({ nullable: true })
    notes?: string;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
