import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Index, OptionalProps } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { CartItem, Category, Restaurant, WishlistItem } from 'entities'
import { ProductIngredient } from '@entities/ingredient/product-ingredient.entity';
import { ProductPackaging } from '@entities/ingredient/product-packaging.entity';
import { RestaurantProduct } from '@entities/restaurant/restaurant-product.entity';

@Entity()
export class Product {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'imageUrl' | 'isActive'

    @PrimaryKey()
    id: string = uuid();

    @Property()
    name!: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ unique: true })
    @Index()
    sku: string; // name in the receipt

    @Property()
    imageUrl?: string;

    @Property({ type: 'decimal', precision: 10, scale: 2 })
    basePrice: number;

    @Property()
    isActive: boolean = true;

    @ManyToOne(() => Category, "products")
    category!: Category;

    @ManyToOne(() => Restaurant, "products")
    restaurant!: Restaurant;

    @OneToMany(() => ProductIngredient, pi => pi.product)
    ingredients = new Collection<ProductIngredient>(this);

    @OneToMany(() => ProductPackaging, pp => pp.product)
    packaging = new Collection<ProductPackaging>(this);

    @OneToMany(() => RestaurantProduct, rp => rp.product)
    restaurantAvailability = new Collection<RestaurantProduct>(this);

    @OneToMany(() => CartItem, item => item.product)
    cartItems = new Collection<CartItem>(this);

    @OneToMany(() => WishlistItem, item => item.product)
    wishlistItems = new Collection<WishlistItem>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
