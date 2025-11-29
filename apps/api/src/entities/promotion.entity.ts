import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { Restaurant } from './restaurant/restaurant.entity';

@Entity()
export class Promotion {
    @PrimaryKey()
    id: string = uuid();

    @Property({ nullable: true })
    code?: string;

    @Property()
    name!: string;

    @Property({ type: 'json', nullable: true })
    rule!: any;

    @Property({ nullable: true })
    startAt?: Date;

    @Property({ nullable: true })
    endAt?: Date;

    @Property({ default: true })
    isActive: boolean = true;

    @ManyToOne(() => Restaurant, { nullable: true })
    restaurant?: Restaurant;
}
