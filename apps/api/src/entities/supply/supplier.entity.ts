import { Entity, PrimaryKey, Property, OneToMany, Collection, OptionalProps } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { SupplierItem } from './supplier-item.entity';
import { SupplyOrder } from './supply-order/supply-order.entity';

@Entity()
export class Supplier {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'meta' | 'isActive' | 'email' | 'phone' | 'address' | 'paymentTerms'

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @Property()
    name: string;

    @Property()
    contactPerson?: string;

    @Property()
    email?: string;

    @Property()
    phone?: string;

    @Property()
    address?: string;

    @Property()
    paymentTerms?: string;

    @Property({ type: 'json', nullable: true })
    meta?: Record<string, any>;

    @Property()
    isActive: boolean = true;

    @OneToMany(() => SupplyOrder, order => order.supplier)
    orders = new Collection<SupplyOrder>(this);

    @OneToMany(() => SupplierItem, item => item.supplier)
    supplierItems = new Collection<SupplierItem>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
