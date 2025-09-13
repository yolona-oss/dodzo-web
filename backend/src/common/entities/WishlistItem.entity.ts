import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WishlistEntity } from "./Wishlist.entity";
import { ProductEntity } from "./Product.entity";
import { EntitiesEnum } from "common/enums/Entities.enum";
import { OrganizationEntity } from "./Organization.entity";

@Entity(EntitiesEnum.WishlistItem)
export class WishlistItemEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WishlistEntity, wishlist => wishlist.items, { onDelete: 'CASCADE' })
    wishlist: WishlistEntity;

    @ManyToOne(() => ProductEntity, product => product.id, { eager: true })
    product: ProductEntity;

    @ManyToOne(() => OrganizationEntity, (org) => org.wishlistItems, { eager: true })
    organization: OrganizationEntity

    @Column({ type: "int", default: 1 })
    quantity: number;
}
