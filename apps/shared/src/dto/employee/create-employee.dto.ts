import { IsEnum, IsUUID } from 'class-validator';
import { EmployeeSpecEnum } from '../../types/employee/employee-spec.type';

export class CreateEmployeeDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    organizationId: string;

    @IsEnum(EmployeeSpecEnum)
    specialization: EmployeeSpecEnum;

    @IsUUID()
    scheduleId: string; // or inline CreateWeekScheduleDto if you prefer
}
