import { Entity, PrimaryKey, ManyToOne, Property, OptionalProps } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { Cart, Product } from 'entities';

@Entity()
export class CartItem {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'meta' | 'unitPrice' | 'totalPrice' | 'qty' | 'isPromotion'

    @PrimaryKey()
    id: string = uuid();

    @ManyToOne(() => Cart, "items")
    cart!: Cart;

    @ManyToOne(() => Product)
    product!: Product;

    @Property()
    qty: number = 1;

    @Property({ nullable: true })
    meta?: any;

    @Property({ nullable: true })
    unitPrice?: number;

    @Property({ type: 'decimal', precision: 10, scale: 2 })
    priceAtAdd: number; // Price when added to cart

    @Property({ nullable: true })
    totalPrice?: number;

    @Property({ default: false })
    isPromotion: boolean = false;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
