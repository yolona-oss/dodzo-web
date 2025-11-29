import { Entity, PrimaryKey, Property, OneToMany, Unique, Collection, Cascade, OptionalProps, t } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { DEFAULT_USER_ROLE, Role, AuthProvider } from '@dodzo-web/shared';

import { Session, Employee, Cart, Wishlist, Order } from 'entities'

@Entity()
export class User {
    [OptionalProps]?: 'firstName' | 'lastName' | 'email' | 'passwordHash' | 'phone' | 'googleId' | 'emailVerified' | 'phoneVerified' | 'preferences';

    @PrimaryKey()
    id: string = uuid();

    @Property({ type: 'varchar', length: 255, nullable: true })
    firstName?: string;

    @Property({ type: 'varchar', length: 255, nullable: true })
    lastName?: string;

    @Property({ nullable: true })
    @Unique()
    email?: string;

    @Property({ nullable: true })
    passwordHash?: string;

    @Property({ nullable: true })
    @Unique()
    phone?: string;

    @Property({ type: t.array, default: [DEFAULT_USER_ROLE] })
    roles!: Role[];

    @Property({ type: 'json', nullable: true })
    preferences?: Record<string, any>;

    @OneToMany(() => Session, s => s.user, { cascade: [Cascade.REMOVE] })
    sessions = new Collection<Session>(this);

    @Property({ default: [AuthProvider.EMAIL], type: t.array })
    providers: AuthProvider[] = [AuthProvider.EMAIL];

    @Property({ nullable: true })
    googleId?: string;

    @Property({ type: 'boolean', default: false })
    emailVerified: boolean = false;

    @Property({ type: 'boolean', default: false })
    phoneVerified: boolean = false;

    @OneToMany(() => Employee, e => e.user)
    employeeAssignments = new Array<Employee>();

    @OneToMany(() => Cart, cart => cart.user)
    carts = new Collection<Cart>(this);

    @OneToMany(() => Wishlist, wishlist => wishlist.user)
    wishlists = new Collection<Wishlist>(this);

    @OneToMany(() => Order, o => o.user)
    orders = new Collection<Order>(this);

    @Property({ type: 'datetime' })
    createdAt = new Date();

    @Property({ type: 'datetime', onUpdate: () => new Date() })
    updatedAt = new Date();
}
