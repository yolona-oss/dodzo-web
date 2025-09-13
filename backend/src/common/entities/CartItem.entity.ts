import { EntitiesEnum } from "common/enums/Entities.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartEntity } from "./Cart.entity";
import { ProductEntity } from "./Product.entity";
import { OrganizationEntity } from "./Organization.entity";

@Entity(EntitiesEnum.CartItem)
export class CartItemEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => CartEntity, cart => cart.items, { onDelete: 'CASCADE' })
    cart: CartEntity;

    @ManyToOne(() => ProductEntity, product => product.cartItems, { eager: true })
    product: ProductEntity;

    @ManyToOne(() => OrganizationEntity, (org) => org.cartItems, { eager: true })
    organization: OrganizationEntity

    @Column({ type: "int", default: 1 })
    quantity: number;
}
