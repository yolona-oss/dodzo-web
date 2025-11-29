import { Entity, PrimaryKey, ManyToOne, Property, OptionalProps } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { Cart, Promotion } from 'entities'

@Entity()
export class CartPromotion {
    [OptionalProps]?: 'result'

    @PrimaryKey()
    id: string = uuid();

    @ManyToOne(() => Cart, "appliedPromotions")
    cart!: Cart;

    @ManyToOne(() => Promotion)
    promotion!: Promotion;

    @Property({ type: 'json', nullable: true })
    result?: any;
}
