import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { EntitiesEnum } from "./../enums/Entities.enum";
import { UserEntity } from "./User.entity"
import { OrganizationEntity } from "./Organization.entity"
import { EmployeeSpecEnum } from "@dodzo-web/shared"
import { WeekScheduleEntity } from "./WeekSchedule.entity"

@Entity(EntitiesEnum.Employee)
export class EmployeeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => UserEntity, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    user: UserEntity

    @ManyToOne(() => OrganizationEntity, (organization) => organization.employees, { onDelete: 'CASCADE' })
    organization: OrganizationEntity

    @Column({type: 'enum', enum: EmployeeSpecEnum})
    specialization: String

    @OneToOne(() => WeekScheduleEntity, (schedule) => schedule.id, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    schedule: WeekScheduleEntity
}
