import { Entity, PrimaryKey, Property, OneToMany, Collection, ManyToOne, OptionalProps } from '@mikro-orm/core';
import { Product } from 'entities/product/product.entity';
import { randomUUID } from 'crypto';
import { Restaurant } from './restaurant/restaurant.entity';

@Entity()
export class Category {
    [OptionalProps]?: 'description' | 'parentCategoryId';

    @PrimaryKey()
    id: string = randomUUID();

    @Property()
    name: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ nullable: true })
    parentCategoryId?: string;

    @ManyToOne(() => Restaurant)
    restaurant: Restaurant

    @OneToMany(() => Product, p => p.category)
    products = new Collection<Product>(this);
}
