import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntitiesEnum } from "./../enums/Entities.enum";
import { ImageEntity } from "./Image.entity";
import { SubCategoryEntity } from "./Subcategory.entity";

@Entity(EntitiesEnum.Category)
export class CategoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: "varchar", length: 255})
    name: string;

    @OneToMany(() => SubCategoryEntity, (subCategory) => subCategory.category)
    subCategories: SubCategoryEntity[]

    @ManyToMany(() => ImageEntity, { cascade: true })
    @JoinTable({
        name: 'category_images',
        joinColumn: { name: 'category_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'image_id', referencedColumnName: 'id' },
    })
    image: ImageEntity[];
}
