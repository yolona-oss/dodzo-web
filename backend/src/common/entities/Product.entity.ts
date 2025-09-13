import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EntitiesEnum } from "./../enums/Entities.enum";
import { ImageEntity } from "./Image.entity";
import { CategoryEntity } from "./Category.entity";
import { SubCategoryEntity } from "./Subcategory.entity";
import { ProductReviewEntity } from "./ProductReview.entity";
import { CartItemEntity } from "./CartItem.entity";
import { OrderItemEntity } from "./OrderItem.entity";
import { WishlistItemEntity } from "./WishlistItem.entity";
import { ProductStockEntity } from "./ProductStock.entity";

@Entity(EntitiesEnum.Product)
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: "varchar", length: 255})
    title: string;

    @Column({type: "varchar", length: 255})
    description: string;

    @Column({type: "varchar", length: 255})
    sku: string;

    @OneToOne(() => ImageEntity, (image) => image.id, { cascade: true, eager: true })
    @JoinColumn()
    primaryImage: ImageEntity

    @OneToMany(() => ImageEntity, (image) => image.id, { cascade: true, eager: true })
    images: ImageEntity[]

    @Column({type: "float"})
    price: number;

    @ManyToOne(() => CategoryEntity, (category) => category.subCategories, { eager: true })
    category: CategoryEntity

    @ManyToOne(() => SubCategoryEntity, (subCategory) => subCategory.products, { nullable: true })
    subCategory: SubCategoryEntity

    @OneToMany(() => ProductReviewEntity, (review) => review.product)
    reviews: ProductReviewEntity[];

    @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product)
    cartItems: CartItemEntity[];

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.product)
    orderItems: OrderItemEntity[];

    @OneToMany(() => WishlistItemEntity, (wishlistItem) => wishlistItem.product)
    wishlistItems: WishlistItemEntity[];

    @OneToMany(() => ProductStockEntity, (stock) => stock.product)
    stockEntries: ProductStockEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
