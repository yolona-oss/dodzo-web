import { CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntitiesEnum } from "./../enums/Entities.enum";
import { OrderEntity } from "./Order.entity";
import { EmployeeEntity } from "./Employee.entity";
import { AddressBookEntity } from "./AddressBook.entity";

@Entity(EntitiesEnum.Delivery)
export class DeliveryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => OrderEntity, (order) => order.delivery, { onDelete: 'CASCADE' })
    order: OrderEntity

    @OneToOne(() => EmployeeEntity, (driver) => driver.id)
    driver: EmployeeEntity

    @OneToOne(() => AddressBookEntity, (destination) => destination.id)
    destination: AddressBookEntity

    @CreateDateColumn()
    createdAt: Date
}
