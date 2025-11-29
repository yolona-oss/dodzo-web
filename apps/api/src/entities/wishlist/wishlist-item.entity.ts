import { Entity, PrimaryKey, ManyToOne, Property, OptionalProps } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { Product, Wishlist } from 'entities';

@Entity()
export class WishlistItem {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'meta' | 'unitPrice' | 'totalPrice' | 'qty' | 'isPromotion' | 'notifyOnAvailable';

    @PrimaryKey()
    id: string = uuid();

    @ManyToOne(() => Wishlist)
    wishlist!: Wishlist;

    @ManyToOne(() => Product)
    product!: Product;

    @Property()
    qty!: number;

    @Property({ nullable: true })
    meta?: any;

    @Property({ nullable: true })
    unitPrice?: number;

    @Property({ nullable: true })
    notifyOnAvailable?: boolean; // Notify when product becomes available

    @Property({ nullable: true })
    totalPrice?: number;

    @Property({ default: false })
    isPromotion: boolean = false;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
