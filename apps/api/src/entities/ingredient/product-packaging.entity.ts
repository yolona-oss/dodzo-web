import { Entity, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Product } from 'entities/product/product.entity';
import { SupplyItem } from 'entities/supply/supply-item.entity';

@Entity()
export class ProductPackaging {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'notes' | 'isRequiredForDelivery' | 'isRequiredForLounge' | 'quantity';

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @ManyToOne(() => Product)
    product: Product;

    @ManyToOne(() => SupplyItem)
    packagingItem: SupplyItem;

    @Property({ type: 'decimal', precision: 10, scale: 3 })
    quantity: number = 1;

    @Property()
    isRequiredForDelivery: boolean = true;

    @Property()
    isRequiredForLounge: boolean = false;

    @Property({ nullable: true })
    notes?: string;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
