import { Entity, Enum, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Product } from 'entities/product/product.entity';
import { SupplyItem } from 'entities/supply/supply-item.entity';
import { UnitOfMeasure } from '@dodzo-web/shared';

@Entity()
export class ProductIngredient {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'notes'

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @ManyToOne(() => Product)
    product: Product;

    @ManyToOne(() => SupplyItem)
    supplyItem: SupplyItem;

    @Property({ type: 'decimal', precision: 10, scale: 3 })
    quantity: number;

    @Enum(() => UnitOfMeasure)
    unit: UnitOfMeasure;

    @Property({ nullable: true })
    notes?: string;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
