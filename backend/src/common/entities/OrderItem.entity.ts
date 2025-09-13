import { EntitiesEnum } from "common/enums/Entities.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./Order.entity";
import { ProductEntity } from "./Product.entity";
import { OrganizationEntity } from "./Organization.entity";

@Entity(EntitiesEnum.OrderItem)
export class OrderItemEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OrderEntity, order => order.items, { onDelete: 'CASCADE' })
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, product => product.orderItems, { eager: true })
    product: ProductEntity;

    @ManyToOne(() => OrganizationEntity, (org) => org.orderItems, { eager: true })
    organization: OrganizationEntity

    @Column({ type: "int", default: 1 })
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    priceAtOrder: number; // Store price at time of order
}
