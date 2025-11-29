import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

@Entity()
export class Unit {
    @PrimaryKey()
    id: string = uuid();

    @Property()
    name!: string; // "gram", "liter", etc.

    @Property()
    symbol!: string; // "g", "L", "pcs"

    @Property({ type: 'float', nullable: true })
    ratioToBase?: number; // For conversions (e.g. 1kg = 1000g)
}
