import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntitiesEnum } from "./../enums/Entities.enum";
import { CustomerEntity } from "./Customer.entity";
import { CartItemEntity } from "./CartItem.entity";

@Entity(EntitiesEnum.Cart)
export class CartEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => CustomerEntity, (customer) => customer.cart)
    customer: CustomerEntity

    @OneToMany(() => CartItemEntity, item => item.cart, { cascade: true })
    items: CartItemEntity[];
}
