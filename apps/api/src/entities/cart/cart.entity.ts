import { Entity, PrimaryKey, ManyToOne, OneToMany, Property, OneToOne, Index, Collection, OptionalProps } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { User, CartItem, Restaurant, CartPromotion } from 'entities'

@Entity()
@Index({ properties: ['user', 'restaurant'] })
export class Cart {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | 'sessionId' | 'expiresAt' | 'isActive'

    @PrimaryKey()
    id: string = uuid();

    @ManyToOne(() => User, "carts")
    user!: User;

    @Property()
    isActive: boolean = true; // Active cart or converted to order

    @Property({ nullable: true })
    sessionId?: string; // For guest carts

    @OneToMany(() => CartItem, ci => ci.cart, { orphanRemoval: true })
    items = new Collection<CartItem>(this);

    @ManyToOne(() => Restaurant, "carts")
    restaurant!: Restaurant

    @OneToMany(() => CartPromotion, cp => cp.cart, { orphanRemoval: true })
    appliedPromotions = new Collection<CartPromotion>(this);

    @Property({ type: 'json', nullable: true })
    totalsSnapshot?: { subtotal: number; discount: number; total: number; currency?: string };

    @Property({ nullable: true })
    expiresAt?: Date; // Auto-cleanup old carts

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
