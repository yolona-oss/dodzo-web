import { Entity, PrimaryKey, ManyToOne, Property, Enum } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { User, Restaurant, WSchedule } from 'entities'
import { EmployeeSpecEnum } from '@dodzo-web/shared';

@Entity()
export class Employee {
    @PrimaryKey()
    id: string = uuid();

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Restaurant)
    restaurant!: Restaurant;

    @Enum({ items: () => EmployeeSpecEnum })
    role!: EmployeeSpecEnum;

    @ManyToOne(() => WSchedule, { nullable: true })
    schedule?: WSchedule;
}
