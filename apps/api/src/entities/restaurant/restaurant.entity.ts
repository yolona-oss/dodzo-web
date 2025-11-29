import { Entity, PrimaryKey, Property, OneToMany, Collection, OptionalProps, ManyToOne, Enum } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { RestaurantStatus } from '@dodzo-web/shared';
import { Address } from '@entities/address.entity';
import { Promotion } from '@entities/promotion.entity';
import { Employee } from '@entities/employee.entity';
import { StockTransfer } from '@entities/stock/stock-tranfser.entity';
import { RestaurantStock } from './restaurant-stock/restaurant-stock.entity';
import { Product } from '@entities/product/product.entity';
import { Cart } from '@entities/cart/cart.entity';
import { Wishlist } from '@entities/wishlist/wishlist.entity';
import { Category } from '@entities/category.entity';
import { WSchedule } from '@entities/wschedule.entity';

@Entity()
export class Restaurant {
    [OptionalProps]?:
    'deliverySettings'
    | 'isActive'
    | 'slug'
    | 'timezone'
    | 'id'
    | 'employees'
    | 'products'
    | 'carts'
    | 'wishlists'
    | 'categories'
    | 'promotions'
    | 'schedule';

    @PrimaryKey()
    id: string = uuid();

    @Property()
    name!: string;

    @Property({ nullable: true })
    slug?: string;

    @Property({ nullable: true })
    timezone?: string;

    @ManyToOne(() => Address)
    address!: Address;

    @ManyToOne(() => WSchedule, { nullable: true })
    schedule: WSchedule;

    @Enum(() => RestaurantStatus)
    status: RestaurantStatus = RestaurantStatus.ACTIVE;

    @Property()
    hasLounge: boolean = true; // Can customers dine in?

    @Property()
    hasDelivery: boolean = true;

    @OneToMany(() => Promotion, p => p.restaurant)
    promotions = new Collection<Promotion>(this);

    @OneToMany(() => Employee, e => e.restaurant)
    employees = new Array<Employee>();

    @OneToMany(() => StockTransfer, transfer => transfer.fromRestaurant)
    outgoingTransfers = new Collection<StockTransfer>(this);

    @OneToMany(() => StockTransfer, transfer => transfer.toRestaurant)
    incomingTransfers = new Collection<StockTransfer>(this);

    @OneToMany(() => RestaurantStock, stock => stock.restaurant)
    stock = new Collection<RestaurantStock>(this);

    @OneToMany(() => Product, r => r.restaurant)
    products = new Collection<Product>(this);

    @OneToMany(() => Cart, c => c.restaurant)
    carts = new Collection<Cart>(this);

    @OneToMany(() => Wishlist, w => w.restaurant)
    wishlists = new Collection<Wishlist>(this);

    @OneToMany(() => Category, cat => cat.restaurant)
    categories = new Collection<Category>(this);

    @Property({ type: 'json', nullable: true })
    deliverySettings?: Record<string, any>;
}
