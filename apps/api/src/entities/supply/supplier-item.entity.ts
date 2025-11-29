import { Collection, Entity, ManyToOne, OneToMany, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Supplier } from './supplier.entity';
import { SupplyItem } from './supply-item.entity';
import { SupplyOrderItem } from './supply-order/supply-order-item.entity';
import { CurrencyEnum } from '@dodzo-web/shared';

@Entity()
export class SupplierItem {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'currency' | 'minimumOrderQuantity' | 'leadTimeDays' | 'isPreferred' | 'isActive' | 'supplierSku'

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @ManyToOne(() => Supplier)
    supplier: Supplier;

    @ManyToOne(() => SupplyItem)
    supplyItem: SupplyItem;

    @Property()
    supplierSku?: string;

    @Property({ type: 'decimal', precision: 10, scale: 2 })
    unitPrice: number;

    @Property()
    currency: string = CurrencyEnum.DEFAULT;

    @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    minimumOrderQuantity?: number;

    @Property({ nullable: true })
    leadTimeDays?: number;

    @Property()
    isPreferred: boolean = false;

    @Property()
    isActive: boolean = true;

    @OneToMany(() => SupplyOrderItem, item => item.supplierItem)
    orderItems = new Collection<SupplyOrderItem>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
