import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';

import { AppError, AppErrorTypeEnum } from './../app-error';
import { WeekScheduleEntity } from 'common/entities/WeekSchedule.entity';
import { CreateWeekScheduleDto } from '@dodzo-web/shared';
import { WeekDayType } from '@dodzo-web/shared';
import { time } from '../misc/time';

@Injectable()
export class WeekScheduleService {
    constructor(
        @InjectRepository(WeekScheduleEntity)
        private readonly weekRepo: Repository<WeekScheduleEntity>,
    ) {}

    async findAll() {
        return await this.weekRepo.find()
    }

    async findById(id: string) {
        return await this.weekRepo.findOne({ where: { id } })
    }

    async remove(id: string) {
        const doc = await this.findById(id)
        if (!doc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        await this.weekRepo.remove(doc)
    }

    private verifySchedule(input: Partial<CreateWeekScheduleDto>) {
        const WEEK_DAYS: WeekDayType[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];

        const validatedSchedule: Record<WeekDayType, { start: string; end: string } | null> = {} as any;

        for (const day of WEEK_DAYS) {
            const entry = input.schedule?.[day] ?? null;

            if (entry && typeof entry.start === "string" && typeof entry.end === "string") {
                if (!time.validateTime(entry.start, "hh:mm")) {
                    throw new Error(`Invalid start time format for ${day}: ${entry.start}`);
                }
                if (!time.validateTime(entry.end, "hh:mm")) {
                    throw new Error(`Invalid end time format for ${day}: ${entry.end}`);
                }

                const msStart = time.timeToMilliseconds(entry.start, "hh:mm");
                const msEnd = time.timeToMilliseconds(entry.end, "hh:mm");

                if (msStart >= msEnd) {
                    throw new Error(`Start time must be before end time for ${day}`);
                }

                validatedSchedule[day] = { start: entry.start, end: entry.end };
            } else {
                validatedSchedule[day] = null;
            }
        }

        return validatedSchedule
    }

    async create(dto: CreateWeekScheduleDto): Promise<WeekScheduleEntity> {
        try {
            const schedule = this.verifySchedule(dto)

            const week_schedule = new WeekScheduleEntity()
            week_schedule.schedule = schedule

            return await this.weekRepo.save(week_schedule)
        } catch (error: any) {
            if (error instanceof TypeORMError) {
                throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE, { message: error.message, })
            } else {
                throw new AppError(AppErrorTypeEnum.VALIDATION_ERROR, { message: error.message })
            }
        }
    }
}
