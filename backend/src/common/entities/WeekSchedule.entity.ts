import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { EntitiesEnum } from "./../enums/Entities.enum";

/*
{
  "monday": { "start": "09:00", "end": "18:00" },
  "tuesday": { "start": "09:00", "end": "18:00" },
  "wednesday": null,
  "thursday": { "start": "10:00", "end": "17:00" },
  "friday": { "start": "09:00", "end": "16:00" },
  "saturday": null,
  "sunday": null
}
*/

@Entity(EntitiesEnum.WeekSchedule)
export class WeekScheduleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'json', nullable: false })
    schedule: {
        [day: string]: { start: string; end: string } | null
    };
}
