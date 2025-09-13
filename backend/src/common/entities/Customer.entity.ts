import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { EntitiesEnum } from "./../enums/Entities.enum";
import { UserEntity } from "./User.entity"
import { CartEntity } from "./Cart.entity"
import { AddressBookEntity } from "./AddressBook.entity"
import { WishlistEntity } from "./Wishlist.entity"
import { OrderEntity } from "./Order.entity"
import { ProductReviewEntity } from "./ProductReview.entity";

@Entity(EntitiesEnum.Customer)
export class CustomerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => UserEntity, (user) => user.id)
    user: UserEntity

    @OneToOne(() => CartEntity, (cart) => cart.customer, { cascade: true })
    @JoinColumn()
    cart: CartEntity

    @OneToMany(() => OrderEntity, (order) => order.customer, { cascade: true})
    @JoinColumn()
    orders: OrderEntity[]

    @OneToOne(() => WishlistEntity, (wishlist) => wishlist.customer, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    wishlist: WishlistEntity

    @OneToOne(() => AddressBookEntity, (addressBook) => addressBook.id)
    @JoinColumn({
        name: 'delivery_address_id',
        referencedColumnName: 'id'
    })
    deliveryAddress: AddressBookEntity

    @OneToMany(() => ProductReviewEntity, (review) => review.customer, { cascade: false })
    @JoinColumn()
    reviews: ProductReviewEntity[];
}
