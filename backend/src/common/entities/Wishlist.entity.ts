import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntitiesEnum } from "./../enums/Entities.enum";
import { CustomerEntity } from "./Customer.entity";
import { WishlistItemEntity } from "./WishlistItem.entity";

@Entity(EntitiesEnum.Wishlist)
export class WishlistEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => CustomerEntity, (customer) => customer.wishlist)
    customer: CustomerEntity

    @OneToMany(() => WishlistItemEntity, item => item.wishlist, { cascade: true, eager: true })
    @JoinColumn()
    items: WishlistItemEntity[];
}
