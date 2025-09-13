import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntitiesEnum } from "./../enums/Entities.enum";
import { CategoryEntity } from "./Category.entity";
import { ProductEntity } from "./Product.entity";

@Entity(EntitiesEnum.Subcategory)
export class SubCategoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => CategoryEntity, (category) => category.subCategories, { eager: true })
    category: CategoryEntity

    @Column({type: "varchar", length: 255})
    name: string;

    @OneToMany(() => ProductEntity, (product) => product.subCategory)
    products: ProductEntity[];
}
