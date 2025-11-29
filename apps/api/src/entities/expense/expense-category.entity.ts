import { Entity, PrimaryKey, Property, Collection, OneToMany } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Expense } from './expense.entity';

@Entity()
export class ExpenseCategory {
    @PrimaryKey()
    id: string = v4();

    @Property()
    name: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ nullable: true })
    parentCategoryId?: string;

    @Property()
    isActive: boolean = true;

    @OneToMany(() => Expense, expense => expense.category)
    expenses = new Collection<Expense>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
