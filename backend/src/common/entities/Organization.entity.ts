import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntitiesEnum } from "./../enums/Entities.enum";
import { AddressBookEntity } from "./AddressBook.entity";
import { OrderEntity } from "./Order.entity";
import { WeekScheduleEntity } from "./WeekSchedule.entity";
import { EmployeeEntity } from "./Employee.entity";
import { ProductStockEntity } from "./ProductStock.entity";
import { CartItemEntity } from "./CartItem.entity";
import { WishlistItemEntity } from "./WishlistItem.entity";
import { OrderItemEntity } from "./OrderItem.entity";
import { ProductStockSettingEntity } from "./ProductStockSetting.entity";

@Entity(EntitiesEnum.Organization)
export class OrganizationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: "varchar", length: 255, unique: true})
    label: string;

    @OneToOne(() => AddressBookEntity, (address) => address.id)
    @JoinColumn()
    address: AddressBookEntity

    @Column({type: "int", default: 0})
    medianDeliveryTime: number

    @Column({type: "datetime"})
    lastMedianDeliveryUpdateTime: Date

    @Column({type: "int", default: 0})
    medianPickupTime: number

    @Column({type: "datetime"})
    lastMedianPickupUpdateTime: Date

    @OneToMany(() => OrderEntity, (order) => order.producer)
    orders: OrderEntity[]

    @OneToMany(() => EmployeeEntity, (employee) => employee.organization)
    employees: EmployeeEntity[]

    @OneToOne(() => WeekScheduleEntity, (schedule) => schedule.id)
    @JoinColumn()
    schedule: WeekScheduleEntity

    @OneToMany(() => ProductStockEntity, (stock) => stock.organization)
    stockEntries: ProductStockEntity[];

    @OneToOne(() => ProductStockSettingEntity, (setting) => setting.organization, { cascade: true })
    @JoinColumn()
    stockSetting: ProductStockSettingEntity

    @OneToMany(() => CartItemEntity, (cartItem) => cartItem.organization)
    cartItems: CartItemEntity[]

    @OneToMany(() => WishlistItemEntity, (wishlistItem) => wishlistItem.organization)
    wishlistItems: WishlistItemEntity[]

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.organization)
    orderItems: OrderItemEntity[]
}
