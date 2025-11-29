import { Entity, Enum, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { SupplyItem } from 'entities/supply/supply-item.entity';
import { UnitOfMeasure } from '@dodzo-web/shared';

@Entity()
export class IngredientComposition {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'notes'

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @ManyToOne(() => SupplyItem)
    complexIngredient: SupplyItem;

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
