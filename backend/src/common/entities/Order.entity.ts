import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntitiesEnum } from "./../enums/Entities.enum";
// import { PaymentEntity } from "./Payment.entity";
import { CustomerEntity } from "./Customer.entity";
import { OrderStatus } from "@dodzo-web/shared";
import { OrganizationEntity } from "./Organization.entity";
import { DeliveryEntity } from "./Delivery.entity";
import { OrderItemEntity } from "./OrderItem.entity";

@Entity(EntitiesEnum.Order)
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => CustomerEntity, (customer) => customer.orders)
    customer: CustomerEntity

    @OneToMany(() => OrderItemEntity, item => item.order, { cascade: true, eager: true })
    items: OrderItemEntity[];

    @Column({type: "varchar", length: 255})
    comment: string;

    @Column({type: "enum", enum: OrderStatus, default: OrderStatus.Pending})
    status: OrderStatus;

    @ManyToOne(() => OrganizationEntity, (organization) => organization.orders)
    producer: OrganizationEntity

    @Column({type: "datetime", nullable: true})
    pickupTime: Date | null

    @OneToOne(() => DeliveryEntity, (delivery) => delivery.order, { nullable: true })
    @JoinColumn()
    delivery: DeliveryEntity | null

    @CreateDateColumn()
    createdAt: Date;

    @Column({type: "datetime", nullable: true})
    closedAt: Date | null
}
