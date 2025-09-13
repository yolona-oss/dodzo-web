import { IsObject, IsString, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WeekDayType } from '@/types';

class DayRangeDto {
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    start: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    end: string;
}

export class CreateWeekScheduleDto {
    @IsObject()
    @ValidateNested()
    @Type(() => Object)
    schedule: Record<WeekDayType, DayRangeDto | null>;
}

export class UpdateWeekScheduleDto extends CreateWeekScheduleDto {}
