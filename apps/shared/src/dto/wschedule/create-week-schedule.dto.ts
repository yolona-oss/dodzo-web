import { IsString, Matches } from 'class-validator';

export class CreateWScheduleDto {
    @IsString()
    date!: string; // e.g. "2025-11-08"

    @IsString()
    @Matches(/^\d{2}:\d{2}$/)
    startTime!: string; // e.g. "20:25"

    @IsString()
    @Matches(/^\d{2}:\d{2}$/)
    endTime!: string; // e.g. "22:00"

    @IsString()
    repeatRule?: string
}
