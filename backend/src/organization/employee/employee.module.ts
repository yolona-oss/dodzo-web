import { forwardRef, Module } from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from 'common/entities/Employee.entity';
import { UserModule } from 'user/user.module';
import { WeekScheduleModule } from 'common/week-schedule/week-schedule.module';
import { OrganizationModule } from 'organization/org.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([EmployeeEntity]),
        UserModule,
        WeekScheduleModule,
        OrganizationModule
    ],
    providers: [EmployeeService],
    controllers: [EmployeeController],
    exports: [EmployeeService]
})
export class EmployeeModule { }
