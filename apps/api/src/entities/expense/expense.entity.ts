import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ExpenseCategory } from './expense-category.entity';
import { Restaurant } from '@entities/restaurant/restaurant.entity';
import { Supplier } from '@entities/supply/supplier.entity';
import { SupplyOrder } from '@entities/supply/supply-order/supply-order.entity';

@Entity()
export class Expense {
    @PrimaryKey()
    id: string = v4();

    @ManyToOne(() => ExpenseCategory)
    category: ExpenseCategory;

    @ManyToOne(() => Restaurant, { nullable: true })
    restaurant?: Restaurant; // Which restaurant incurred this expense

    @Property()
    description: string;

    @Property({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Property()
    currency: string = 'USD';

    @Property()
    expenseDate: Date;

    @ManyToOne(() => Supplier, { nullable: true })
    supplier?: Supplier;

    @ManyToOne(() => SupplyOrder, { nullable: true })
    supplyOrder?: SupplyOrder;

    @Property({ nullable: true })
    invoiceNumber?: string;

    @Property({ nullable: true })
    receiptUrl?: string;

    @Property({ nullable: true })
    userId?: string;

    @Property({ type: 'json', nullable: true })
    metadata?: Record<string, any>;

    @Property({ nullable: true })
    notes?: string;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
