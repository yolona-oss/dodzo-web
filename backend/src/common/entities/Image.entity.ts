import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { EntitiesEnum } from "./../enums/Entities.enum";

@Entity(EntitiesEnum.Image)
export class ImageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: "varchar", length: 255, nullable: true, unique: true})
    blankType?: string;

    @Column({type: "varchar", length: 255})
    uploader: string;

    @Column({type: "json", nullable: true})
    uploaderData: any

    @Column({type: "varchar", length: 255})
    url: string;
}
