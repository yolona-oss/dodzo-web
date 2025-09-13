import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntitiesEnum } from "./../enums/Entities.enum";
import { ProductEntity } from "./Product.entity";
import { CustomerEntity } from "./Customer.entity";

@Entity(EntitiesEnum.ProductReview)
export class ProductReviewEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => ProductEntity, (product) => product.id)
    @JoinColumn()
    product: ProductEntity

    @ManyToOne(() => CustomerEntity, (customer) => customer.reviews)
    @JoinColumn()
    customer: CustomerEntity

    @Column({type: "varchar", length: 2047})
    body: string;

    @Column({type: "int", default: 5})
    rating: number;
}
