import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { WeekScheduleEntity } from 'common/entities/WeekSchedule.entity';
import { WeekScheduleService } from './week-schedule.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([WeekScheduleEntity]),
    ],
    providers: [WeekScheduleService],
    exports: [WeekScheduleService]
})
export class WeekScheduleModule { }
