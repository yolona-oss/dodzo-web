import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { EntitiesEnum } from "./../enums/Entities.enum";

@Entity(EntitiesEnum.AddressBook)
export class AddressBookEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: "varchar", length: 255})
    coordinates: string

    @Column({type: "varchar", length: 255})
    address: string

    @Column({type: "varchar", length: 255})
    label: string
}
