// import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm"
// import { EntitiesEnum } from "./../enums/Entities.enum";
// import { OrderEntity } from "./Order.entity"
// import { CustomerEntity } from "./Customer.entity"
//
// @Entity(EntitiesEnum.Payment)
// export class PaymentEntity {
//     @PrimaryGeneratedColumn('uuid')
//     id: string
//
//     @OneToOne(() => CustomerEntity, (customer) => customer.id)
//     customer: CustomerEntity
//
//     @OneToOne(() => OrderEntity, (order) => order.payment)
//     order: OrderEntity
//
//     @Column({type: "int"})
//     amount: number
//
//     @Column({type: "varchar", length: 255})
//     status: string
//
//     @Column({type: "varchar", length: 255})
//     paymentMethod: string
//
//     @Column({type: "varchar", length: 255, nullable: true})
//     providerPaymentId?: string;
// }
