import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationController } from './org.controller';
import { OrganizationService } from './org.service';
import { OrganizationEntity } from 'common/entities/Organization.entity';
import { AddressBookEntity } from 'common/entities/AddressBook.entity';
import { WeekScheduleEntity } from 'common/entities/WeekSchedule.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrganizationEntity,
            AddressBookEntity,
            WeekScheduleEntity
        ]),
        // forwardRef(() => EmployeeModule),
    ],
    providers: [OrganizationService],
    controllers: [OrganizationController],
    exports: [OrganizationService]
})
export class OrganizationModule { }
