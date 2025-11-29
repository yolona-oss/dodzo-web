import { Entity, Index, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Restaurant } from './restaurant.entity';
import { Product } from '@entities/product/product.entity';

@Entity()
@Index({ properties: ['restaurant', 'product'] })
export class RestaurantProduct {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'customizations' | 'estimatedPrepTime' | 'priceOverride' | 'isAvailable' | 'availableForDelivery' | 'availableInLounge';

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @ManyToOne(() => Restaurant)
    restaurant: Restaurant;

    @ManyToOne(() => Product)
    product: Product;

    @Property()
    isAvailable: boolean = true;

    @Property()
    availableForDelivery: boolean = true;

    @Property()
    availableInLounge: boolean = true;

    @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    priceOverride?: number; // Restaurant-specific pricing

    @Property({ nullable: true })
    estimatedPrepTime?: number; // Minutes

    @Property({ type: 'json', nullable: true })
    customizations?: Record<string, any>;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
