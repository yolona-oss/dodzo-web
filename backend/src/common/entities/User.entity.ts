import { Role } from "@dodzo-web/shared";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable,
    ManyToMany,
} from "typeorm"
import { ImageEntity } from "./Image.entity";
import { EntitiesEnum } from "./../enums/Entities.enum";

@Entity(EntitiesEnum.User)
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 255 })
    username: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    firstName: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    lastName: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
    phone?: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'boolean', default: false })
    emailVerified: boolean;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @ManyToMany(() => ImageEntity, { cascade: true })
    @JoinTable({
        name: 'user_images',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'image_id', referencedColumnName: 'id' },
    })
    images: ImageEntity[];

    @Column({ type: 'simple-array', default: Role.User })
    roles: Role[];

    @Column({type: "simple-array"})
    tokens: string[];

    @Column({ type: 'varchar', length: 255, nullable: true })
    resetPasswordToken: string | null

    @Column({ type: 'datetime', nullable: true })
    resetPasswordTokenExpiry: Date | null

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
