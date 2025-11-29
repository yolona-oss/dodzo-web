import { SupplyItemType, UnitOfMeasure } from '@dodzo-web/shared';
import { Entity, PrimaryKey, Property, Enum, Index, OneToMany, Collection, OptionalProps } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { SupplierItem } from './supplier-item.entity';
import { IngredientComposition } from '@entities/ingredient/ingredient-composition.entity';
import { ProductIngredient } from '@entities/ingredient/product-ingredient.entity';
import { RestaurantStock } from '@entities/restaurant/restaurant-stock/restaurant-stock.entity';
import { Batch } from '@entities/stock/batch.entity';

@Entity()
export class SupplyItem {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'isActive' | 'storageInstructions' | 'shelfLife'

    @PrimaryKey()
    id: string = v4();

    @Property()
    name: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ unique: true })
    @Index()
    sku: string;

    @Enum(() => SupplyItemType)
    type: SupplyItemType;

    @Enum(() => UnitOfMeasure)
    unit: UnitOfMeasure;

    @Property({ type: 'json', nullable: true })
    storageInstructions?: Record<string, any>;

    @Property({ nullable: true })
    shelfLife?: number; // Days

    @Property()
    isActive: boolean = true;

    @OneToMany(() => SupplierItem, item => item.supplyItem)
    supplierRelations = new Collection<SupplierItem>(this);

    @OneToMany(() => IngredientComposition, comp => comp.supplyItem)
    usedInCompositions = new Collection<IngredientComposition>(this);

    @OneToMany(() => ProductIngredient, pi => pi.supplyItem)
    usedInProducts = new Collection<ProductIngredient>(this);

    @OneToMany(() => RestaurantStock, stock => stock.supplyItem)
    restaurantStocks = new Collection<RestaurantStock>(this);

    @OneToMany(() => Batch, batch => batch.supplyItem)
    batches = new Collection<Batch>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
