import { EntitiesEnum } from "common/enums/Entities.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductEntity } from "./Product.entity";
import { OrganizationEntity } from "./Organization.entity";

@Entity(EntitiesEnum.ProductStock)
export class ProductStockEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ProductEntity, (product) => product.stockEntries, { eager: true })
    product: ProductEntity;

    @ManyToOne(() => OrganizationEntity, (org) => org.stockEntries, { eager: true })
    organization: OrganizationEntity;

    @Column({ type: 'int', nullable: true })
    count: number | null; // null when isInfinite = true

    @Column({ type: 'boolean', default: false })
    isInfinite: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
