import { Entity, PrimaryKey, ManyToOne, OneToMany, Index, Property, OptionalProps, Collection } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { User, Restaurant } from 'entities'
import { WishlistItem } from 'entities/wishlist/wishlist-item.entity';

@Entity()
@Index({ properties: ['user', 'restaurant'] })
export class Wishlist {
    [OptionalProps]?: 'createdAt' | 'updatedAt'

    @PrimaryKey()
    id: string = uuid();

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Restaurant)
    restaurant!: Restaurant;

    @OneToMany(() => WishlistItem, item => item.wishlist, { orphanRemoval: true })
    items = new Collection<WishlistItem>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
