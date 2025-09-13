import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AppError, AppErrorTypeEnum } from './../../common/app-error';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'user/services/user.service';
import { WeekScheduleService } from 'common/week-schedule/week-schedule.service';
import { OrganizationService } from 'organization/org.service';
import { CreateEmployeeDto } from '@dodzo-web/shared';
import { EmployeeEntity } from 'common/entities/Employee.entity';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeeRepo: Repository<EmployeeEntity>,
        private readonly userService: UserService,
        private readonly scheduleService: WeekScheduleService,
        @Inject(forwardRef(() => OrganizationService))
        private readonly orgService: OrganizationService
    ) {}

    async findAll() {
        return await this.employeeRepo.find()
    }

    async findById(id: string): Promise<EmployeeEntity | null> {
        return await this.employeeRepo.findOne({ where: { id } })
    }

    async findByUserId(userId: string) {
        const user_e = await this.userService.findById(userId)
        if (!user_e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                { message: 'Cannot find Employee: user not found' }
            )
        }
        return await this.employeeRepo.findOne({where: { user: user_e }})
    }

    async create(dto: CreateEmployeeDto): Promise<EmployeeEntity> {
        const emploeer_e = new EmployeeEntity()
        const user_e = await this.userService.findById(dto.userId)
        const org_e = await this.orgService.findById(dto.organizationId)
        const schedule_e = await this.scheduleService.findById(dto.scheduleId)

        if (!user_e || !org_e || !schedule_e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                { message: 'Cannot create Employee: user or organization or schedule not found' }
            )
        }

        emploeer_e.user = user_e
        emploeer_e.organization = org_e
        emploeer_e.schedule = schedule_e
        emploeer_e.specialization = dto.specialization

        return await this.employeeRepo.save(emploeer_e)
    }

    async asignScheduleByUser(userId: string, schedule: string) {
        const schedule_e = await this.scheduleService.findById(schedule)
        const user_e = await this.userService.findById(userId)

        if (!user_e || !schedule_e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        const res = await this.employeeRepo.update(
            { user: user_e },
            { schedule: schedule_e }
        )

        if (res.affected === 0) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
    }

    async asignOrgByUser(userId: string, orgId: string) {
        const org_e = await this.orgService.findById(orgId)
        const user_e = await this.userService.findById(userId)

        if (!user_e || !org_e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        const res = await this.employeeRepo.update(
            { user: user_e },
            { organization: org_e }
        )

        if (res.affected === 0) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
    }

    async remove(userId: string) {
        const emploeer_e = await this.findByUserId(userId)
        if (!emploeer_e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        await this.employeeRepo.remove(emploeer_e)
    }
}
